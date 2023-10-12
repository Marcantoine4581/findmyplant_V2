FROM node:18-alpine

WORKDIR /app

COPY package*.json .

# install exactly the same dependancies
RUN npm ci

COPY . .

# EXPOSE 5000

# CMD ["npm", "start"]
# CMD ["npm", "run", "dev"]
CMD ["npm", "test"]
# CMD ["bash"]