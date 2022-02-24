FROM mono

RUN nuget update -self

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash

RUN apt-get install -y nodejs

RUN npm install -g gulp mocha

WORKDIR /data
