#!/bin/sh

set -e

export PYTHONPATH=/app/flowio:$PYTHONPATH

echo "Waiting for the database to be available......"

while ! mysqladmin ping -h"$DB_HOST" --silent; do
  sleep 1
done

echo "Database available. Continuing..."

echo "Initializing data......"
if ! python /app/flowio/manage.py create_flowio_db; then
  echo "Database initialization failed!" >&2
  exit 1
fi

echo "Waiting for Redis to be available..."
while ! nc -z redis 6379; do
  sleep 1
done

echo "Running collectstatic..."
python /app/flowio/manage.py collectstatic --noinput

echo "Redis available. Continuing..."

echo "Starting Celery worker..."
celery -A flowio.celery_app  worker --loglevel=info &

echo "Starting Django server..."
exec python /app/flowio/manage.py runserver 0.0.0.0:8000
