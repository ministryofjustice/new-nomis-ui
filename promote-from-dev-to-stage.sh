#!/usr/bin/env bash

# Grab the DEV build
git checkout deploy-to-dev
git pull --rebase

# Push the DEV build to PREPROD
git push --force origin origin/deploy-to-dev:deploy-to-stage

# Switch back to master branch
git checkout master
