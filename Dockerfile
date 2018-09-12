FROM node
EXPOSE 3000
COPY . /home/app
WORKDIR /home/app
RUN npm install
