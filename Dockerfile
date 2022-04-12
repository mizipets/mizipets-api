FROM node:16.14.0-alpine As production

WORKDIR /usr/src/pet-finder-api

COPY package*.json ./

RUN echo ${API_PREFIX}

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 3001

CMD [ "npm", "run", "start:staging" ]
