FROM debian:jessie

# PHANTOM INSTALL ======================= START
# Install runtime dependencies
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        ca-certificates \
        bzip2 \
        libfontconfig \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

RUN set -x  \
   # Install official PhantomJS release
&& apt-get update \
&& apt-get install -y --no-install-recommends \
       curl \
&& mkdir /tmp/phantomjs \
&& curl -L https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 \
       | tar -xj --strip-components=1 -C /tmp/phantomjs \
&& mv /tmp/phantomjs/bin/phantomjs /usr/local/bin \
   # Install dumb-init (to handle PID 1 correctly).
   # https://github.com/Yelp/dumb-init
&& curl -Lo /tmp/dumb-init.deb https://github.com/Yelp/dumb-init/releases/download/v1.1.3/dumb-init_1.1.3_amd64.deb \
&& dpkg -i /tmp/dumb-init.deb \
   # Clean up
&& apt-get purge --auto-remove -y \
       curl \
&& apt-get clean \
&& rm -rf /tmp/* /var/lib/apt/lists/* \
   \
   # Run as non-root user.
&& useradd --system --uid 72379 -m --shell /usr/sbin/nologin phantomjs \
&& su phantomjs -s /bin/sh -c "phantomjs --version"
# PHANTOM INSTALL ======================= END

# NODE ======================= START
# Install the basic requirements
RUN apt-get update \
&& apt-get install -y openssh-server \
        git \
        wget \
        g++ \
        python \
        make
 
# Prepare the required ssh details
RUN mkdir ~/.ssh
RUN ssh-keyscan -T 10 github.com >> ~/.ssh/known_hosts

WORKDIR /tmp

RUN wget https://nodejs.org/download/release/v0.10.26/node-v0.10.26.tar.gz
RUN tar -zxvf node-v0.10.26.tar.gz
RUN cd node-v0.10.26 && ./configure && make && make install
# NODE ======================= END

# CALENDAR UI ======================= START
# Reserve the build arg to allow details to be injected from codeship
ARG PRIVATE_SSH_KEY

# Create the directory for our application
RUN mkdir -p /usr/src/app
# Set the current working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY npm-shrinkwrap.json ./
COPY bower.json ./

RUN npm install -g bower

# Keep this one command, to not expose the secret.
# This will also do an npm install  as well as follow it up with a bower install to ensure
# the ember application has all the correct dependencies.
RUN echo "$PRIVATE_SSH_KEY" >> $HOME/.ssh/id_rsa \
    && chmod o-rw $HOME/.ssh/id_rsa \
    && chmod g-rw $HOME/.ssh/id_rsa \
    && npm install \
    && bower install --allow-root \
    && rm $HOME/.ssh/id_rsa

# Add the application source code
COPY . ./
# CALENDAR UI ======================= END