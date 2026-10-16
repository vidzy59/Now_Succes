#!/usr/bin/env bash
# Pokit (Ponsel Kita) project start.
# Installs dependencies, publishes deployment output, then serves in the foreground.
# Runs inside the controller-owned tmux app-server session; keep this script foreground-blocking.
set -euo pipefail
cd "$(dirname "$0")" # builtin: /usr/bin/time cannot time shell builtins
PROJECT_ROOT="$PWD"
/usr/bin/time -p pwd
/usr/bin/time -p test -f package.json
/usr/bin/time -p test -f server.js
/usr/bin/time -p test -f public/index.html
PORT="${PORT:-3000}"
export PORT
if [[ ! -d node_modules/express ]]; then
  /usr/bin/time -p npm install --no-audit --no-fund
fi
# Build only when the project defines a build step; Pokit ships static public/ as-is.
/usr/bin/time -p node -e "const s=require('./package.json').scripts||{}; if(!s.build){console.log('no build step, skipping')} else {console.log('build step present')}"
if /usr/bin/time -p node -e 'process.exit((require("./package.json").scripts||{}).build ? 0 : 1)'; then
  /usr/bin/time -p npm run build
fi
STATIC_DIR="$PROJECT_ROOT/public"
/usr/bin/time -p test -f "$STATIC_DIR/index.html"
/usr/bin/time -p mkdir -p "${OPENCODE_WEB_DIR:?}"
/usr/bin/time -p node -e 'const fs=require("fs"),path=require("path");fs.writeFileSync(path.join(process.env.OPENCODE_WEB_DIR,"deployment-output.json"),JSON.stringify({project:process.cwd(),directory:path.join(process.cwd(),"public")}))'
/usr/bin/time -p cat "$OPENCODE_WEB_DIR/deployment-output.json"
exec node server.js # builtin: replaces this shell with the foreground server
