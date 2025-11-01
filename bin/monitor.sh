#!/usr/bin/env bash

sudo docker exec $1 tail -f arcology/bin/status.log
