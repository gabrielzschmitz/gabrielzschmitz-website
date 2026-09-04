#!/usr/bin/env bash

set -euo pipefail

# ============================================================
# gabrielzschmitz.xyz build script
#
# Builds the Zola site and injects research references from
# static/assets/research/ref.bib using BibInject.
#
# Usage:
#   ./build.sh            Build the site for production.
#   ./build.sh --serve    Build, serve, and watch for changes.
# ============================================================

# ============================================================
# Colors
# ============================================================

RESET="\033[0m"
BOLD="\033[1m"
DIM="\033[2m"
WHITE="\033[37m"
GREEN="\033[32m"
CYAN="\033[36m"
YELLOW="\033[33m"
RED="\033[31m"

# ============================================================
# Configuration
# ============================================================

ZOLA_VERSION="v0.23.4"
ZOLA_URL="https://github.com/getzola/zola/releases/download/${ZOLA_VERSION}/zola-${ZOLA_VERSION}-x86_64-unknown-linux-musl.tar.gz"
ZOLA_BIN="${ZOLA_BIN:-zola}"

BIB_VERSION="v2.2.2"
BIB_URL="https://github.com/gabrielzschmitz/BibInject/archive/refs/tags/${BIB_VERSION}.tar.gz"
BIB_DIR="${BIB_DIR:-/tmp/BibInject-${BIB_VERSION}}"
BIB_SOURCE="./static/assets/research/ref.bib"
BIB_REFPEC="apa"
BIB_REFPEC_MINI="mini"

# Custom compact refspec shipped with this repo and copied into BibInject's
# refspec/ dir on every run (even a cached clone), for the portfolio sidebar.
# The research page uses BibInject's built-in `apa` refspec.
REFPEC_MINI_SRC="./static/refspec/mini.html"

RESEARCH_HTML="./public/research/index.html"
PORTFOLIO_HTML="./public/index.html"

# ============================================================
# Banner
# ============================================================

print_banner() {
  local mode="$1"
  echo -e "${BOLD}${RED}"
  echo "========================================"
  echo "           gabrielzschmitz.xyz"
  echo "        Zola + BibInject builder"
  echo "========================================"
  echo -e "${RESET}"
  if [[ "$mode" == "serve" ]]; then
    echo -e "${CYAN}${BOLD}Mode:${RESET} watch (auto rebuild + BibInject, served locally)"
  else
    echo -e "${CYAN}${BOLD}Mode:${RESET} production build"
  fi
  echo
}

# ============================================================
# Helpers
# ============================================================

log_ok()   { echo -e "  ${GREEN}[OK]${RESET} $1"; }
log_warn() { echo -e "  ${YELLOW}[WARN]${RESET} $1"; }
log_err()  { echo -e "  ${RED}[ERROR]${RESET} $1"; }
log_info() { echo -e "  ${CYAN}[INFO]${RESET} $1"; }

ensure_zola() {
  if [[ "$ZOLA_BIN" == "zola" ]] && command -v zola >/dev/null 2>&1; then
    log_ok "Zola found: $(zola --version)"
    return
  fi
  if [[ -x "$ZOLA_BIN" ]]; then
    log_ok "Zola found at $ZOLA_BIN"
    return
  fi
  log_warn "Zola not found. Downloading ${ZOLA_VERSION}..."
  local tmp_dir
  tmp_dir="$(mktemp -d)"
  curl -sL "$ZOLA_URL" | tar xz -C "$tmp_dir"
  mv "$tmp_dir/zola" /usr/local/bin/zola
  ZOLA_BIN="zola"
  rm -rf "$tmp_dir"
  log_ok "Zola installed: $(zola --version)"
}

ensure_bibinject() {
  if [[ -f "$BIB_DIR/bibinject.sh" ]] && [[ -d "$BIB_DIR/.venv" ]]; then
    log_ok "BibInject ${BIB_VERSION} ready at $BIB_DIR"
  else
    log_info "Preparing BibInject ${BIB_VERSION}..."

    rm -rf "$BIB_DIR"

    local tmp_dir
    tmp_dir="$(mktemp -d)"

    curl -sL "$BIB_URL" | tar xz -C "$tmp_dir"

    local extracted_dir
    extracted_dir="$(find "$tmp_dir" -mindepth 1 -maxdepth 1 -type d | head -n 1)"

    mv "$extracted_dir" "$BIB_DIR"
    rm -rf "$tmp_dir"

    (
      cd "$BIB_DIR"
      ./setup.sh >/dev/null 2>&1
    )

    log_ok "BibInject ${BIB_VERSION} set up at $BIB_DIR"
  fi

  # Overlay this repo's custom compact refspec so `mini` is always available.
  if [[ -f "$REFPEC_MINI_SRC" ]]; then
    cp "$REFPEC_MINI_SRC" "$BIB_DIR/refspec/${BIB_REFPEC_MINI}.html"
  fi
}

run_bibinject() {
  # $1 = target html, $2 = target id, $3 = refspec (default: apa)
  local html="$1"
  local target="$2"
  local refspec="${3:-$BIB_REFPEC}"
  log_info "Injecting refs → ${target} (into ${html}) [${refspec}]..."
  
  (
    cd "$BIB_DIR"
    ./.venv/bin/python -m src.app \
      --input "$OLDPWD/$BIB_SOURCE" \
      --refspec "$refspec" \
      --html "$OLDPWD/$html" \
      --target-id "$target" \
      --order desc \
      "$OLDPWD/$html" >/dev/null 2>&1
  )

  log_ok "Injected ${target}"
}

inject_all() {
  echo -e "${BOLD}${CYAN}=== BibInject - research page ==========${RESET}"
  run_bibinject "$RESEARCH_HTML" "references" "$BIB_REFPEC"

  echo
  echo -e "${BOLD}${CYAN}=== BibInject - portfolio sidebar ======${RESET}"
  run_bibinject "$PORTFOLIO_HTML" "references-sidebar" "$BIB_REFPEC_MINI"
}

# ============================================================
# Build (single pass)
# ============================================================

run_build() {
  echo -e "${BOLD}${CYAN}=== Zola build =========================${RESET}"
  ensure_zola
  ensure_bibinject
  "$ZOLA_BIN" build

  echo
  inject_all

  echo
  log_ok "Build complete (output in ./public)"
}

# ============================================================
# Serve (watch-mode)
# ============================================================

# Fingerprint of all source files Zola depends on, so the watch loop can
# detect changes without extra tooling (inotifywatchers etc.).
sources_fingerprint() {
    find ./content ./static ./templates -type f -printf '%p %T@ %s\n' \
        2>/dev/null | sort | md5sum | awk '{print $1}'
}

http_server_available() {
    command -v python3 >/dev/null 2>&1 && python3 -c "import http.server" >/dev/null 2>&1
}

run_serve() {
    ensure_zola
    ensure_bibinject

    # zola serve renders in-memory and never writes injected output to ./public,
    # so BibInject could never process it. Instead we run our own watch loop that
    # rebuilds to ./public (baking in BibInject) and serve ./public statically.

    log_warn "startup build…"
    "$ZOLA_BIN" build
    inject_all

    local port="${PORT:-1111}"
    local serve_pid=""

    if http_server_available; then
        ( cd ./public && exec python3 -m http.server "$port" >/dev/null 2>&1 ) &
        serve_pid=$!
        echo
        echo -e "${GREEN}${BOLD}Serving http://127.0.0.1:${port}/${RESET}"
    else
        # No python3 - fall back to zola serve (BibInject output won't be
        # reflected in the browser, but the build pipeline still runs).
        log_warn "python3 http.server not found - using zola serve (no BibInject in browser)."
        "$ZOLA_BIN" serve --port "$port" &
        serve_pid=$!
        sleep 2
        echo
        echo -e "${GREEN}${BOLD}Serving http://127.0.0.1:${port}/${RESET}"
    fi

    trap 'echo; log_warn "Stopping server (pid $serve_pid)..."; kill "$serve_pid" 2>/dev/null || true; exit 0' INT TERM

    local last_fp="$(sources_fingerprint)"

    echo
    echo -e "${BOLD}${GREEN}Watching for changes in content/, static/, templates/…${RESET} (Ctrl+C to stop)"
    echo

    while true; do
        sleep 2
        local fp="$(sources_fingerprint)"
        if [[ "$fp" != "$last_fp" ]]; then
            last_fp="$fp"
            echo
            echo -e "${YELLOW}${BOLD}Change detected - rebuilding + reinjecting${RESET}"
            "$ZOLA_BIN" build
            inject_all
            echo -e "${GREEN}Rebuild complete.${RESET}"
            echo
        fi

        if ! kill -0 "$serve_pid" 2>/dev/null; then
            log_err "Server stopped unexpectedly."
            exit 1
        fi
    done
}

# ============================================================
# Main
# ============================================================

MODE="build"

for arg in "$@"; do
  case "$arg" in
    --serve)
      MODE="serve"
      ;;
    --help|-h)
      echo "Usage: $0 [--serve]"
      echo "  --serve   watch-mode build (auto rebuild + BibInject, served locally)"
      exit 0
      ;;
    *)
      log_err "Unknown argument: $arg"
      exit 1
      ;;
  esac
done

print_banner "$MODE"

if [[ "$MODE" == "serve" ]]; then
  run_serve
else
  run_build
fi
