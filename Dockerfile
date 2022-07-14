# build stage
FROM node:lts-alpine as build-stage
ENV VITE_CLIENT_ID=993289969587-mop06tf2bg7jarsucgn5un66011tqgj6.apps.googleusercontent.com
ENV VITE_API_URL=https://project-journal-backend.fly.dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
