#!/bin/zsh

# The bridge secret stays in the logged-in user's macOS Keychain, never in this
# repository or a launch configuration file.
set -eu

bridge_token="$(/usr/bin/security find-generic-password -a "$USER" -s 'in-god-hands-ollama-bridge-token' -w)"

if [[ ${#bridge_token} -lt 32 ]]; then
  print -u2 'In Göd Hands Honey bridge token is unavailable.'
  exit 1
fi

export OLLAMA_BRIDGE_TOKEN="$bridge_token"
export OLLAMA_BRIDGE_PORT="11435"
export OLLAMA_BASE_URL="http://127.0.0.1:11434"
export OLLAMA_MODEL="qwen3.5:4b"

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  source "$HOME/.nvm/nvm.sh"
fi

exec node "$(cd "$(dirname "$0")/.." && pwd)/scripts/ollama-bridge.mjs"
