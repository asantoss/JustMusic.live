FROM node:10

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm update

COPY . .

EXPOSE 4000
RUN npm i -g nodemon
CMD npx sequelize-cli db:create

ENTRYPOINT ["npm", "run", "dev"]