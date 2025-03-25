FROM node:20.10

WORKDIR /app

RUN rm -rf node_modules package-lock.json

COPY package*.json ./

RUN npm cache clean --force
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
