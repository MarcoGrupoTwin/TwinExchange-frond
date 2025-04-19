### Stage 1: Build ###

FROM node:16-alpine3.14 AS build
WORKDIR /app
COPY package.json ./
RUN npm install --force
COPY . .
RUN npm run build

### Stage 2: Run ###
FROM nginx:1.21.6-alpine AS prod-stage
COPY nginx.conf /etc/nginx/conf.d/custom.conf
COPY --from=build /app/dist/version /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]