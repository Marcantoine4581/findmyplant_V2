FROM node:18-alpine

WORKDIR /app

COPY package*.json .

# install exactly the same dependancies
RUN npm ci

COPY . .

# EXPOSE 3000

CMD ["npm", "start"]