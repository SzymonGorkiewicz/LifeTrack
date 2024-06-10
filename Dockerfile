FROM node:18.19 as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including Angular CLI
RUN npm install
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

COPY . .

# Build the Angular app
RUN npm run build

FROM nginx:stable

# Copy built files to nginx's default directory
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

