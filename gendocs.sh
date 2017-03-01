#!/usr/bin/env bash

#based on:
#https://hiddentao.com/archives/2016/08/29/triggering-travis-ci-build-from-another-projects-build/

body='{
"request": {
  "message": "Regen docs from module update",
  "branch": "master"
}}'

curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Travis-API-Version: 3" \
  -H "Authorization: token $TRAVIS_API_TOKEN" \
  -d "$body" \
  https://api.travis-ci.org/repo/awayjs%2Fdocs/requests