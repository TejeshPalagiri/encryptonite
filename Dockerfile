# Intializae node
FROM node:18-slim
WORKDIR /app
COPY . /app/
# RUN npm i && npm run build
# RUN apt-get update && apt-get install redis-server -y && service redis-server start
EXPOSE 4000
RUN cd server
CMD ['npm', 'start']