# Node image: https://hub.docker.com/_/node/
FROM node:21.1-alpine3.18 as base
WORKDIR /var/www/html
COPY package*.json ./
EXPOSE 3000

FROM base as builder
WORKDIR /var/www/html
COPY . .
RUN npm run build

FROM base as production
ARG WORKDIR=/var/www/html
WORKDIR $WORKDIR
ENV NODE_ENV=production
ARG USER_NAME=nonroot
ARG GROUP_NAME=docker
ARG USER_ID=1001
ARG GROUP_ID=$USER_ID
RUN npm ci
RUN addgroup -gid $GROUP_ID $GROUP_NAME
RUN adduser -uid $USER_ID -gid $GROUP_ID $USER_NAME
USER $USER_NAME
COPY --from=builder --chown=$USER_NAME:$GROUP_NAME $WORKDIR/.next ./.next
COPY --from=builder $WORKDIR/node_modules ./node_modules
COPY --from=builder $WORKDIR/package.json ./package.json
COPY --from=builder $WORKDIR/public ./public
CMD npm start

FROM base as development
ENV NODE_ENV=development
RUN npm install 
COPY . .
CMD npm run dev