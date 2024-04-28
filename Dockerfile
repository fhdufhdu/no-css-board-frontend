FROM nginx:1.25.5

RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /etc/nginx/conf.d/*
COPY ./nginx.conf /etc/nginx/conf.d/

COPY ./build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;"]