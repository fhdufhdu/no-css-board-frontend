FROM node:18 AS builder

COPY ./package.json /frontend/package.json
COPY ./package-lock.json /frontend/package-lock.json
WORKDIR /frontend
RUN npm install

COPY . /frontend
RUN npm run build

FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /etc/nginx/conf.d/*
COPY ./nginx.conf /etc/nginx/conf.d/

COPY --from=builder /frontend/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;"]