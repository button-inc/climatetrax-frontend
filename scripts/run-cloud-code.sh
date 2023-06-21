#!/bin/bash

code --install-extension GoogleCloudTools.cloudcode

code --extension-dir "$HOME/.vscode/extensions" --user-data-dir "$HOME/.vscode/cloudcode" \
     --wait \
     --enable-proposed-api GoogleCloudTools.cloudcode \
     --locale=en-US \
     --unity-launch . \
     --command cloudcode.dev.run
