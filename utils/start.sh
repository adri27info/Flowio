#!/bin/bash

echo "Starting backend..."
cd ../backend
docker-compose up --build -d
if [ $? -ne 0 ]; then
  echo "Error starting backend."
  exit 1
fi

echo "Starting frontend..."
cd ../frontend
docker-compose up --build -d
if [ $? -ne 0 ]; then
  echo "Error starting frontend."
  exit 1
fi

cd ..
echo "Both services (frontend and backend) are running."

