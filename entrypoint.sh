#!/usr/bin/env bash
set -e
set -o pipefail

download_minishift() {
  echo Downloading Minishift $INPUT_MINISHIFT_VERSION
  VERSION=${INPUT_MINISHIFT_VERSION//[a-zA-Z]}
  curl -Lo minishift.tgz "https://github.com/minishift/minishift/releases/download/$INPUT_MINISHIFT_VERSION/minishift-$VERSION-linux-amd64.tgz"
  tar -xf minishift.tgz
  mv ./minishift-*/minishift minishift
  chmod +x minishift
  echo $(./minishift version) installed
}

echo Setting up Minishift
download_minishift
