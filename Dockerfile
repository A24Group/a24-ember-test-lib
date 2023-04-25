# Docker file that will be used to deploy our projects to firebase
FROM debian:sid-slim

# Create the required directories
RUN mkdir -p /usr/src/app
RUN mkdir ~/.ssh

# Set the current working directory
WORKDIR /usr/src/app

# APT DEFAULTS
RUN apt-get update
RUN apt-get -y install curl git openssh-server wget
# Leaving this here for when we want to use the latest chrome version
# RUN apt-get -y install curl git openssh-server wget gpg

# Install Chrome
# Leaving this here for when we want to use the latest chrome version
# RUN echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' > /etc/apt/sources.list.d/google-chrome.list
# RUN wget -O- https://dl.google.com/linux/linux_signing_key.pub |gpg --dearmor > /etc/apt/trusted.gpg.d/google.gpg
RUN wget --no-verbose -O /tmp/chrome.deb https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_96.0.4664.110-1_amd64.deb
# Leaving this here for when we want to use the latest chrome version
# RUN set -x \
#    && apt-get update \
#    && apt-get install -y \
#        xvfb \
#        google-chrome-stable
RUN set -x \
    && apt-get update \
    && apt-get install -y \
        xvfb \
    && apt install -y /tmp/chrome.deb \
    && rm /tmp/chrome.deb
RUN ln -sf /usr/bin/xvfb-chrome /usr/bin/google-chrome
ENV CHROME_BIN /usr/bin/google-chrome

# Install NVM
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> /etc/profile
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" --install  # This loads nvm' >> /etc/profile

# Install the correct node version based on the nvm rc
COPY .nvmrc ./
RUN bash -c 'source /etc/profile && npm install -g yarn@1.7.0 && node -v'

# Do github keyscan
RUN ssh-keyscan -T 10 github.com >> ~/.ssh/known_hosts

# Reserve the build arg to allow details to be injected from codeship
ARG PRIVATE_SSH_KEY

#   CUSTOM ADDON DOCKER
# =======================

COPY package.json ./
COPY yarn.lock ./

# Keep this one command, to not expose the secret.
# This will also do an npm install
RUN echo "$PRIVATE_SSH_KEY" >> $HOME/.ssh/id_rsa \
    && chmod o-rw $HOME/.ssh/id_rsa \
    && chmod g-rw $HOME/.ssh/id_rsa \
    && bash -c 'source /etc/profile && yarn install' \
    && rm $HOME/.ssh/id_rsa

# Add the application source code
COPY . ./
