FROM node:alpine
WORKDIR /app
COPY package*.json ./

COPY .env ./

COPY . .
RUN npm install
EXPOSE 8000

CMD npm run start:dev