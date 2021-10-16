FROM node:16-alpine3.11

ENV NODE_ENV=production
EXPOSE 5000

WORKDIR /app

COPY ["tsconfig.json", "package.json", "package-lock.json*", "./"]

RUN npm install --production

RUN npm run build

COPY . .

CMD [ "npm", "start"]