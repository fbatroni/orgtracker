#!/usr/bin/env bash
REDIS_NAME=orgtracker-redis
IS_REDIS_RUNNING=$(netstat -nat | grep 6379 | grep LISTEN)

if [ -z "$IS_REDIS_RUNNING" ]; then # not running
  if ! docker ps -a -f name=${REDIS_NAME} | grep ${REDIS_NAME}; then
    echo "Starting local Redis..."
    docker run --name ${REDIS_NAME} -p 6379:6379 -d redis > /dev/null 2>&1
  else
    if ! docker ps -f name=${REDIS_NAME} | grep ${REDIS_NAME}; then
      echo "Starting local Redis..."
      docker start ${REDIS_NAME} > /dev/null 2>&1
    else
      echo "Local Redis already running. Using existing redis on port: 6379"
    fi
  fi
else
  echo "Local Redis already running. Using existing redis on port: 6379"
fi
