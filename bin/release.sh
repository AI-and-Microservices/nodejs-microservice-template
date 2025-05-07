#!/usr/bin/env bash

git pull
docker compose build
yarn up prod