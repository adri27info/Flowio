from __future__ import absolute_import, unicode_literals

import os
from django.conf import settings
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "flowio.conf.settings")

app = Celery("flowio")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
