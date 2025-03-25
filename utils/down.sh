#!/bin/bash

echo "Stopping and removing backend containers..."
cd ../backend && docker-compose down

echo "Stopping and removing frontend containers..."
cd ../frontend && docker-compose down
cd ..

echo "Deleting unused volumes..."
docker volume prune -f

echo "Process completed."
