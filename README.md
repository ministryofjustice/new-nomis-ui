# Syscon web

This is the front end web app for syscon; has a dev server for speedy hotloading.

It is primarily using all the info from (react-boilerplate)[https://github.com/react-boilerplate/react-boilerplate]

## Dev start

clone the project

run `yarn`

run `yarn start`

## Dev work

Use git flow with automated naming style (just enter through `git flow init`)

### FEATURE START
`git flow feature start myNewFeature`

do work & commit it to your branch `feature/myNewFeature`

### FEATURE FINISH
`git flow feature finish myNewFeature`

## Warnings!

If you run prod on localhost... service workers will try to maintain the current version foreeeever... it's actually pretty annoying. This is probably something we don't want to have happen in real life.

Turn off server & go to localhost:3000 and kill all the cookies.
