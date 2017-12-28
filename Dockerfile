FROM node
RUN mkdir -p /server
COPY index.js /server
EXPOSE 8080
CMD [ "node", "/server/index" ]
