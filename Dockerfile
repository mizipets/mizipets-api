FROM node:16.14.0-alpine As production

WORKDIR /usr/src/pet-finder-api

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

RUN echo ${API_PREFIX}

RUN npm ci

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
# docker-compose up --env-file .env.staging^C-build
