# Docker file that will be used to deploy our projects to firebase
FROM debian:jessie

# Create the required directories
RUN mkdir -p /usr/src/app
RUN mkdir ~/.ssh

# Set the current working directory
WORKDIR /usr/src/app

# APT DEFAULTS
RUN apt-get update
RUN apt-get -y install curl git openssh-server wget

# Install Chrome
RUN echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' > /etc/apt/sources.list.d/chrome.list
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN set -x \
    && apt-get update \
    && apt-get install -y \
        xvfb \
        google-chrome-stable
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
