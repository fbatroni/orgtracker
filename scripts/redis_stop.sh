#!/usr/bin/env bash

REDIS_NAME=orgtracker-redis

if ! docker ps -a -f name=$REDIS_NAME | grep ${REDIS_NAME}; then
	echo "Local Redis was not running."
else
  echo "Halting local Redis..."
	docker kill ${REDIS_NAME} > /dev/null 2>&1
fi

