# replace ~ in path as shell won't automatically expand ~s
CURRENT_WORKING_DIRECTORY="${CIRCLE_WORKING_DIRECTORY//\~/$HOME}"
VERSION_FILE="$CURRENT_WORKING_DIRECTORY/VERSION"

GIT_COMMIT_DESC=$(git log --format=oneline --pretty=format:"Commit SHA: <$CIRCLE_COMPARE_URL|%H>%nAuthor: %an%nCommitted on: %cd%nCommit message: %s" -n 1 $CIRCLE_SHA1)
CURRENT_VERSION="unknown"
if (test -a $VERSION_FILE); then
  CURRENT_VERSION=$(cat $VERSION_FILE)
fi
CURRENT_VERSION_DESC="Version: $CURRENT_VERSION"

printf "$CURRENT_VERSION_DESC\n$GIT_COMMIT_DESC"
