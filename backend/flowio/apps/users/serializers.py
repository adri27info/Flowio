import mimetypes

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from django.conf import settings

from apps.roles.models import Role
from apps.users.models import User
from apps.users.validators import PasswordValidator
from apps.users.tasks import send_email_register
from utils.utils_general import UtilsGeneral

from rest_framework import serializers
from apps.users.models import User
from apps.roles.models import Role


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "surnames",
            "email",
            "attachment",
            "role_id",
            "created_at",
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[PasswordValidator()])
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
    )
    attachment = serializers.FileField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "name",
            "surnames",
            "email",
            "password",
            "role_id",
            "attachment",
            "created_at",
        ]

    def validate_attachment(self, value):
        if value is None:
            raise ValidationError("You must send an image")

        if value and value.size > 5 * 1024 * 1024:
            raise ValidationError("The file must not exceed 5 MB.")

        mime_type, _ = mimetypes.guess_type(value.name)
        if mime_type not in ["image/jpeg", "image/png"]:
            raise ValidationError("Only JPG and PNG images are allowed.")

        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[PasswordValidator()]
    )
    attachment = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "name",
            "surnames",
            "password",
            "attachment",
        ]

    def validate_attachment(self, value):
        if value is None:
            raise ValidationError("You must send an image")

        if value and value.size > 5 * 1024 * 1024:
            raise ValidationError("The file must not exceed 5 MB.")

        mime_type, _ = mimetypes.guess_type(value.name)
        if mime_type not in ["image/jpeg", "image/png"]:
            raise ValidationError("Only JPG and PNG images are allowed.")

        return value

    def update(self, instance, validated_data):
        password = validated_data.get("password", None)
        if password:
            instance.set_password(password)
            instance.save()
            validated_data["password"] = instance.password
        return super().update(instance, validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            if not user.is_active:
                raise ValidationError(
                    {
                        "detail": "This account is inactive. Please activate your account."
                    }
                )
            attrs["user"] = user
        else:
            raise ValidationError({"detail": "Email or password incorrects."})

        return attrs


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[PasswordValidator()])
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
    )
    attachment = serializers.FileField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "name",
            "surnames",
            "email",
            "password",
            "role_id",
            "attachment",
            "created_at",
        ]

    def validate_attachment(self, value):
        if value is None:
            raise ValidationError("You must send an image")

        if value and value.size > 5 * 1024 * 1024:
            raise ValidationError("The file must not exceed 5 MB.")

        mime_type, _ = mimetypes.guess_type(value.name)
        if mime_type not in ["image/jpeg", "image/png"]:
            raise ValidationError("Only JPG and PNG images are allowed.")

        return value

    def create(self, validated_data):
        validated_data["is_active"] = False
        validated_data["activation_code"] = UtilsGeneral.generate_activation_code()
        user = User.objects.create_user(**validated_data)
        return user


class ResendActivationCodeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = User
        fields = ["email"]

    def validate(self, data):
        user = User.objects.filter(email=data["email"]).first()

        if not user:
            raise ValidationError({"detail": "User with this email does not exist."})

        if user.is_active:
            raise ValidationError({"detail": "This account is already active."})

        if user.registration_attempts >= 5:
            raise ValidationError(
                {
                    "detail": f"You have exceeded the maximum number of activation attempts. Please contact the email {settings.EMAIL_HOST_USER}."
                }
            )

        activation_code = UtilsGeneral.generate_activation_code()
        user.activation_code = activation_code
        user.registration_attempts += 1
        user.save(update_fields=["registration_attempts", "activation_code"])

        send_email_register.delay(user.email, activation_code)

        return data


class ActivateAccountSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    activation_code = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "activation_code"]

    def validate(self, data):
        user = User.objects.filter(email=data["email"]).first()

        if not user:
            raise ValidationError({"detail": "User with this email does not exist."})

        if user.is_active:
            raise ValidationError({"detail": "This account is already active."})

        if user.activation_code != data["activation_code"]:
            raise ValidationError({"detail": "Invalid activation code."})

        user.is_active = True
        user.registration_attempts = 0
        user.save(update_fields=["is_active", "registration_attempts"])

        return data


class BlacklistTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(max_length=255, required=True)

    def validate_refresh_token(self, value):
        if value != value.strip():
            raise serializers.ValidationError(
                "Refresh token cannot have leading or trailing spaces."
            )
        return value
