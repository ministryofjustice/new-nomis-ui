#!/usr/bin/env bash

# This script requires the 'jq' command line tool
brew install jq

# Grab the DEV build
git checkout deploy-to-dev
git pull --rebase

# Push the DEV build to PREPROD
git push --force origin origin/deploy-to-dev:deploy-to-preprod

# Switch back to master branch
git checkout master
