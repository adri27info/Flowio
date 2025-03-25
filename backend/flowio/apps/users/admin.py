from django.contrib import admin

from apps.users.models import User, BlacklistedToken

# Register your models here.
admin.site.register(User)
admin.site.register(BlacklistedToken)
