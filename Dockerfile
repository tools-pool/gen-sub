ARG NODE_VERSION
FROM node:${NODE_VERSION}

ENV PROJECT_PATH /usr/local/gen-sub

COPY package.json yarn.lock ${PROJECT_PATH}/
WORKDIR ${PROJECT_PATH}

RUN yarn

COPY . .

ENTRYPOINT yarn tsc && yarn start