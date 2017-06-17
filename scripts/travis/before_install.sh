#!/bin/bash
set -e -v

echo "Now testing on $TRAVIS_OS_NAME"
echo "Using the android emulator? $USE_EMULATOR"
echo "Travis branch is $TRAVIS_BRANCH"
echo "Travis is in pull request $TRAVIS_PULL_REQUEST"
echo "Build triggered by $TRAVIS_EVENT_TYPE"
echo "Using node $TRAVIS_NODE_VERSION"

# ensure that the PR branch exists locally
#git config --add remote.origin.fetch "+refs/heads/$BRANCH:refs/remotes/origin/$BRANCH"
#git fetch

# if the branch doesn't exist, make it (the branch only exists on push builds, not PR ones)
#if ! git rev-parse --quiet --verify "$BRANCH" > /dev/null; then
  #git branch "$BRANCH"
#fi

# turn off fancy npm stuff
npm config set spin=false
npm config set progress=false

npm install -g npm@5
npm install -g greenkeeper-lockfile@1
