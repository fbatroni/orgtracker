#!/usr/bin/env bash

POSTGRES_NAME=orgtracker-postgres

if ! docker ps -a -f name=$POSTGRES_NAME | grep ${POSTGRES_NAME}; then
	echo "Local Postgres was not running."
else
  echo "Halting local Postgres..."
	docker kill ${POSTGRES_NAME} > /dev/null 2>&1
fi

