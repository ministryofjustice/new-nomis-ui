#!/usr/bin/env bash

# Grab the DEV build
git checkout deploy-to-stage
git pull --rebase

# Push the DEV build to PREPROD
git push --force origin origin/deploy-to-stage:deploy-to-preprod

# Switch back to master branch
git checkout master
