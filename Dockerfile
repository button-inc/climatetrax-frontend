# # ------------------ dev build -------------------
FROM node:18.13.0-alpine as build_dev
RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . .
COPY .env.dev ./.env

RUN npm run build

# # ------------------dev -------------------

# Use the official Node.js 14 image as the base image
FROM node:18.13.0-alpine as dev

# Set the working directory inside the container
WORKDIR /app

# Copy files/project dependencies to the working directory
COPY --from=build_dev /app/.env .
COPY --from=build_dev /app/package.json .
COPY --from=build_dev /app/pnpm-lock.yaml .
COPY --from=build_dev /app/next.config.js ./next.config.js
COPY --from=build_dev /app/node_modules/ ./node_modules/
COPY --from=build_dev /app/public/ ./public/
COPY --from=build_dev /app/.next/ ./.next/

# Build the Next.js app
CMD ["/bin/sh", "-c", "npm start"]

