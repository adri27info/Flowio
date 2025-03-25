import random
import certifi
import ssl
import boto3
import time

from django.conf import settings


class UtilsGeneral:

    @staticmethod
    def generate_activation_code():
        """
        Generate a random activation code between 10000 and 99999.
        """
        return str(random.randint(10000, 99999))

    @staticmethod
    def create_ssl_context():
        """
        Create an SSL context using certifi to ensure the use of a trusted CA bundle.
        """
        context = ssl.create_default_context(cafile=certifi.where())
        return context

    @staticmethod
    def get_bucket_s3():
        """
        Retrieve the S3 bucket resource if S3 is enabled in settings.
        Returns False if S3 is not enabled.
        """
        if not settings.USE_S3:
            return False

        s3 = boto3.resource(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_DEFAULT_REGION,
        )
        return s3.Bucket(settings.AWS_STORAGE_BUCKET_NAME)

    @staticmethod
    def invalidate_cache_cloudfront(paths):
        """
        Invalidate the CloudFront cache for the given paths to ensure the most
        up-to-date content is served.
        """
        try:
            if isinstance(paths, str):
                paths = [paths]

            paths = [
                f"/{path.lstrip('/')}" if not path.startswith("/") else path
                for path in paths
            ]

            client = boto3.client("cloudfront")
            client.create_invalidation(
                DistributionId=settings.CLOUDFRONT_DISTRIBUTION_ID,
                InvalidationBatch={
                    "Paths": {
                        "Quantity": len(paths),
                        "Items": paths,
                    },
                    "CallerReference": str(time.time()),
                },
            )
        except Exception as e:
            print(f"Error invalidating cache for {paths}: {e}")
