#!/usr/bin/env bash

# if less than two arguments supplied, display usage 
if [  $# -le 1 ]
then
  display_usage
  exit 1
fi
 
# check whether user had supplied -h or --help . If yes display usage 
if [[ ( $# == "--help") ||  $# == "-h" ]]
then
  display_usage
  exit 0
fi

promote_to_env $1 $2

promote_to_env() {
  TAG=$1
  ENV=$2

  # Grab the tagged build
  git fetch
  git checkout $TAG
  git pull --rebase

  # Push the TAG build to ENV
  git push --force $TAG origin/deploy-to-${ENV}

  # Switch back to master branch
  git checkout master
}

display_usage() { 
  echo -e "\nUsage: $0 [tag] [env]\n"
} 
