#!/bin/bash

# Get the absolute path to the script's directory
DIR=$(dirname "$0")

# Load the variables from .env file
. "$DIR/.env"

# Create a temporary file for the service account JSON
TEMP_FILE=$(mktemp)

# Write the service account JSON to the temporary file
echo "$SERVICE_ACCOUNT_JSON" > "$TEMP_FILE"

# Set the path to the temporary service account JSON file and export it
export GOOGLE_APPLICATION_CREDENTIALS="$TEMP_FILE"

# Build the Next.js application
npm run build

# Start the Next.js application in production mode
# For production mode, ensure a root .env file exists with the NEXTAUTH_SECRET to prevent error:  [next-auth][error][NO_SECRET] https://next-auth.js.org/errors#no_secret Please define a `secret` in production. MissingSecret [MissingSecretError]: Please define a `secret` in production.
npm run start &

# Wait for a few seconds to ensure the Next.js application is ready
sleep 5

# Run your Playwright test
npx playwright test tests/gcs

# Clean up the temporary files and folder
rm -rf "$TEMP_DIR"

# Find the process ID of the Next.js application and stop it
NEXT_JS_PID=$(ps aux | grep "npm run start" | grep -v grep | awk '{print $2}')
kill "$NEXT_JS_PID"
