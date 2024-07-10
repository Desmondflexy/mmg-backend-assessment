FROM node:alpine

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
