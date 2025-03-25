import os

from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

from apps.users.models import User
from apps.users.tasks import send_email_register
from apps.roles.models import Role
from apps.users.tasks import rename_file_s3, delete_files_s3

DEFAULT_IMAGE_S3 = "attachments/user/default/user_default.png"


@receiver(pre_save, sender=User)
def save_old_attachment(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = User.objects.get(pk=instance.pk)
            instance._old_attachment = old_instance.attachment.name
        except User.DoesNotExist:
            instance._old_attachment = None
    else:
        instance._old_attachment = None


@receiver(post_save, sender=User)
def send_activation_email(sender, instance, created, **kwargs):
    if created:
        admin_role = Role.objects.filter(name="admin").first()
        if admin_role and admin_role.id != instance.role_id:
            if not instance.is_active:
                activation_code = instance.activation_code
                send_email_register.delay(instance.email, activation_code)
                print(f"Email sent correctly to {instance.email}")
            else:
                print(
                    f"The email is not sent because the user {instance.email} is already active"
                )


@receiver(post_save, sender=User)
def attach_user_image_s3(sender, instance, created, **kwargs):
    if hasattr(instance, "_attachment_saved") and instance._attachment_saved:
        return

    if instance.attachment and instance.attachment.name != DEFAULT_IMAGE_S3:
        path = instance.attachment.name if created else instance._old_attachment
        renamed_path = (
            path.replace("None", str(instance.id))
            if created
            else instance.attachment.name
        )
        user_folder_path = (
            f"flowio/media/{path}" if "None" in path else f"flowio/media/{renamed_path}"
        )
        if created:
            rename_file_s3.delay(user_folder_path, str(instance.id))
        else:
            delete_files_s3.delay(
                user_folder_path,
                operation_from="delete_oldest_files",
            )
        instance.attachment.name = renamed_path
        instance._attachment_saved = True
        instance.save(update_fields=["attachment"])
        print(f"File renamed correctly: {path} -> {renamed_path}")


@receiver(post_delete, sender=User)
def delete_user_image_s3(sender, instance, **kwargs):
    if instance.attachment != DEFAULT_IMAGE_S3:
        user_folder_path = f"flowio/media/{os.path.dirname(instance.attachment.name)}"
        delete_files_s3.delay(
            user_folder_path,
            operation_from="delete_all",
        )
