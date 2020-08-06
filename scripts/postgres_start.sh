#!/usr/bin/env bash
POSTGRES_NAME=orgtracker-postgres
IS_POSTGRES_RUNNING=$(netstat -nat | grep 5432 | grep LISTEN)

if [ -z "$IS_REDIS_RUNNING" ]; then # not running
  if ! docker ps -a -f name=${POSTGRES_NAME} | grep ${POSTGRES_NAME}; then
      echo "Starting local Postgres..."
      docker run --rm --name ${POSTGRES_NAME} -e POSTGRES_PASSWORD=docker -d -p 5432:5432 postgres > /dev/null 2>&1
  else
    if ! docker ps -f name=${POSTGRES_NAME} | grep ${POSTGRES_NAME}; then
      echo "Starting local Postgres..."
      docker start ${POSTGRES_NAME} > /dev/null 2>&1
    else
      echo "Local Postgres already running. Using existing Postgres on port: 5432"
    fi
  fi
else
  echo "Local Postgres already running. Using existing Postgres on port: 5432"
fi



