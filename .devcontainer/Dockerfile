FROM denoland/deno:bin-2.1.3 AS deno
FROM mcr.microsoft.com/devcontainers/typescript-node:20
COPY --from=deno /deno /usr/local/bin/deno

# Install zsh and Chezmoi
RUN apt-get update && \
    apt-get install -y zsh curl git tmux ripgrep

ENV XDG_CONFIG_HOME="/home/node/.config"
ENV XDG_DATA_HOME="/home/node/.local/share"
ENV XDG_CACHE_HOME="/home/node/.cache"
ENV ZDOTDIR="/home/node/.config/zsh"
ENV TMUX_CONF="/home/node/.config/tmux/tmux.conf"

USER node

RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && \
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)" && \
    brew install chezmoi && \
    chezmoi init --apply https://github.com/alkca/dotfiles-public.git 

