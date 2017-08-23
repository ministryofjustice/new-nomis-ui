#!/usr/bin/env bash

# Grab the DEV build
git checkout deploy-to-preprod
git pull --rebase

# Push the DEV build to PREPROD
git push --force origin origin/deploy-to-preprod:deploy-to-prod

# Switch back to master branch
git checkout master
