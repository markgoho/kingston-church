FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set versions for our tools as arguments
ARG HUGO_VERSION=0.156.0
ARG DART_SASS_VERSION=1.93.2
ARG BUN_VERSION=1.3.9
ARG PLAYWRIGHT_VERSION=1.57.0

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl \
  wget \
  ca-certificates \
  unzip \
  git \
  && rm -rf /var/lib/apt/lists/*

# Configure git to trust the workspace directory to avoid ownership errors in GitHub Actions
RUN git config --global --add safe.directory /__w/kingston-church/kingston-church && \
  git config --system --add safe.directory /__w/kingston-church/kingston-church && \
  git config --system --add core.quotepath false

# Install Node.js 22.x (required by Firebase Functions)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs

# 2. Install Bun
RUN curl -fsSL https://bun.com/install | bash -s "bun-v${BUN_VERSION}"
ENV PATH="/root/.bun/bin:$PATH"

# 3. Install Hugo (Extended Version)
RUN wget "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb" \
  && apt-get install -y ./hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
  && rm hugo_extended_${HUGO_VERSION}_linux-amd64.deb

# 4. Install Dart Sass
RUN wget "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz" \
  && tar -xzf "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz" \
  && mv dart-sass /usr/local/share/ \
  && ln -s /usr/local/share/dart-sass/sass /usr/local/bin/sass \
  && rm "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz"

RUN echo "Bun version: $(bun --version)"
RUN echo "Hugo version: $(hugo version)"
RUN echo "Sass version: $(sass --version)"
RUN echo "Node.js version: $(node --version)"

# Set the working directory for when the container starts
WORKDIR /workspace
