import os

from celery import shared_task
from django.core.mail import send_mail
from django.core.mail.backends.smtp import EmailBackend
from django.conf import settings

from utils.utils_general import UtilsGeneral


@shared_task
def send_email_register(user_email, activation_code):
    """
    Sends an activation email with the activation code to the specified user.
    Uses an SSL context using certifi for secure email transmission.

    Args:
        user_email (str): The email address of the user.
        activation_code (str): The activation code to be sent in the email.
    """
    context = UtilsGeneral.create_ssl_context()

    subject = "Activate your account"
    message = f"Your activation code is: {activation_code}"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user_email]

    try:
        connection = EmailBackend(
            host=settings.EMAIL_HOST,
            port=settings.EMAIL_PORT,
            username=settings.EMAIL_HOST_USER,
            password=settings.EMAIL_HOST_PASSWORD,
            use_tls=settings.EMAIL_USE_TLS,
            context=context,
        )
        send_mail(subject, message, from_email, recipient_list, connection=connection)
    except Exception as e:
        print(f"Error sending email: {e}")


@shared_task
def invalidate_cloudfront_cache(path):
    """
    Invalidates the CloudFront cache for a specific file in S3.

    This task triggers a cache invalidation request to CloudFront, ensuring
    that the latest version of the file is served instead of the cached version.
    The invalidation is performed for the provided S3 file path, which should
    be the path to the file that has been updated or deleted.

    Args:
        path (str): The S3 file
    """
    UtilsGeneral.invalidate_cache_cloudfront(path)


@shared_task
def rename_file_s3(user_folder_path, instance_id):
    """
    Renames a file in an S3 bucket by replacing "None" with the instance ID.

    Args:
        user_folder_path (str): The path to the user's folder in S3.
        instance (object): The instance whose ID will replace "None"
        in the file name.
    """
    try:
        bucket = UtilsGeneral.get_bucket_s3()
        if bucket:
            files_in_folder = list(bucket.objects.filter(Prefix=user_folder_path))
            if files_in_folder:
                for file in files_in_folder:
                    if file.key == user_folder_path:
                        old_key = file.key
                        new_key = old_key.replace("None", instance_id)
                        copy_source = {"Bucket": bucket.name, "Key": old_key}
                        bucket.copy(copy_source, new_key)
                        bucket.Object(old_key).delete()
                        print(f"File renamed from {old_key} to {new_key}")
        else:
            print("S3 bucket not found")
    except Exception as e:
        print(f"Error renaming file: {e}")


@shared_task
def delete_files_s3(user_folder_path, operation_from=None):
    """
    Deletes files in an S3 bucket, either based on a specific user folder path or
    all files in a folder. Depends of the operation_from key, this function has to
    invalidate all paths from cloudfront cache or the oldest ones.

    Args:
        user_folder_path (str): The path to the user's folder in S3.
        operation_from (str, optional): If "delete_all", delete all files in the parent
        folder. If "delete_oldest_files", delete the oldest files but leave the most recent.
        Defaults to None.
    """
    try:
        bucket = UtilsGeneral.get_bucket_s3()
        if bucket:
            if operation_from is not None:
                if operation_from == "delete_all":
                    files_in_folder = list(
                        bucket.objects.filter(Prefix=user_folder_path)
                    )
                    if files_in_folder:
                        delete_keys = [{"Key": file.key} for file in files_in_folder]
                        if delete_keys:
                            bucket.delete_objects(Delete={"Objects": delete_keys})
                            print(f"All files deleted correctly in: {user_folder_path}")
                            invalidate_cloudfront_cache.delay(f"{user_folder_path}/*")
                elif operation_from == "delete_oldest_files":
                    files_in_folder = list(
                        bucket.objects.filter(Prefix=os.path.dirname(user_folder_path))
                    )
                    if files_in_folder and len(files_in_folder) == 5:
                        files_in_folder_sorted = sorted(
                            files_in_folder, key=lambda x: x.last_modified, reverse=True
                        )
                        files_to_delete = files_in_folder_sorted[1:]
                        paths_to_invalidate = [file.key for file in files_to_delete]
                        delete_keys = [{"Key": file.key} for file in files_to_delete]
                        if delete_keys:
                            bucket.delete_objects(Delete={"Objects": delete_keys})
                            invalidate_cloudfront_cache.delay(paths_to_invalidate)
            else:
                print("Operation type is not specified.")
        else:
            print("S3 bucket not found")
    except Exception as e:
        print(f"Error deleting files in prefix {user_folder_path}: {e}")
