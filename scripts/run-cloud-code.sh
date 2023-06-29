#!/bin/bash
# export GOOGLE_APPLICATION_CREDENTIALS=/home/shon/Workspace/Button/certs/emissions-elt-demo-ecc9c7e27bf4.json

code --install-extension GoogleCloudTools.cloudcode

code --extension-dir "$HOME/.vscode/extensions" --user-data-dir "$HOME/.vscode/cloudcode" \
     --wait \
     --enable-proposed-api GoogleCloudTools.cloudcode \
     --locale=en-US \
     --unity-launch . \
     --command cloudcode.dev.run
