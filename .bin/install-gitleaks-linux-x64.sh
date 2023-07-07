#!/usr/bin/env bash
set -xeuo pipefail;

releases_api="https://api.github.com/repos/gitleaks/gitleaks/releases/latest"
releases_json="$(curl -s ${releases_api})"
version=$(echo "${releases_json}" | jq -r ".name" | cut -c 2-) #Extracts the version from the json

# Detect OS architecture and set the arch variable
case "$(uname -m)" in
  'amd64')   arch="x64" ;;
  'x86_64')  arch="x64" ;;
  'i386')    arch="x32" ;;
  'i686')    arch="x32" ;;
  'armv6')   arch="armv6" ;;
  'armv7')   arch="armv7" ;;
  *)         echo "unsupported architecture"; exit 1 ;;
esac

# Detect OS type and set the os variable
case "$(uname -s)" in
  Linux*)    os="linux" ;;
  Darwin*)   os="darwin" ;;
  CYGWIN*)   os="windows" ;;
  MINGW*)    os="windows" ;;
  MSYS*)     os="windows" ;;
  *)         echo "unsupported OS"; exit 1 ;;
esac

# Construct the filename to search for in the API response
filename="gitleaks_${version}_${os}_${arch}.zip"

# Debugging lines: echo variables
echo "Version: ${version}"
echo "OS: ${os}"
echo "Arch: ${arch}"
echo "Filename: ${filename}"

# Find the download URL for the desired asset
download_url=$(echo "${releases_json}" | jq -r ".assets[] | select(.name==\"${filename}\") | .browser_download_url")

# Check if download URL is found
if [ -z "${download_url}" ]; then
  echo "Could not find a download URL for ${filename}"
  exit 1
fi

# Echo the download URL
echo "Download URL: ${download_url}"

# Download the asset
wget "${download_url}"

# Extract the zip file
unzip "gitleaks_${version}_${os}_${arch}.zip"

# Cleanup
rm "gitleaks_${version}_${os}_${arch}.zip"

exit 0;
