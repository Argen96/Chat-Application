FROM --platform=linux/amd64 node:19.3

# Create app directory
WORKDIR /var/www/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm install -g knex
COPY . /var/www/app

EXPOSE 80

CMD [ "yarn", "start" ]