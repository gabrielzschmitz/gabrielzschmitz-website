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
# Music playlist (static/assets/music/*.mp3 -> public playlist.json)
# ============================================================

generate_music_playlist() {
  local src="./static/assets/music"
  local out="./public/assets/music/playlist.json"
  python3 - "$src" "$out" <<'PY'
import json
import os
import sys
import urllib.parse

src, out = sys.argv[1], sys.argv[2]

credits = {}
credits_path = os.path.join(src, "credits.json")
if os.path.exists(credits_path):
    with open(credits_path, encoding="utf-8") as f:
        credits = json.load(f)

tracks = []
for name in sorted(os.listdir(src)):
    if not name.lower().endswith(".mp3"):
        continue
    title = os.path.splitext(name)[0]
    track = {
        "title": title,
        "src": "/assets/music/" + urllib.parse.quote(name),
    }
    meta = credits.get(name, {})
    for key in ("artist", "album", "year", "source", "copyright", "license"):
        if meta.get(key):
            track[key] = meta[key]
    tracks.append(track)
with open(out, "w", encoding="utf-8") as f:
    json.dump(tracks, f, ensure_ascii=False, indent=2)
PY
  log_ok "Playlist → ${out} ($(python3 -c "import json;print(len(json.load(open('$out'))))") tracks)"
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
  generate_music_playlist

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
    generate_music_playlist

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
            generate_music_playlist
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
# Screenshots (--screenshots)
# ============================================================

SHOT_DIR="${SHOT_DIR:-./static/assets/images}"

# First Chromium-based browser found on PATH.
chromium_binary() {
    local bin
    for bin in chromium-browser chromium google-chrome google-chrome-stable; do
        if command -v "$bin" >/dev/null 2>&1; then
            echo "$bin"
            return 0
        fi
    done
    return 1
}

# $1 = URL path, $2 = output file. Captures headlessly at --window-size.
screenshot_page() {
    local path="$1"
    local out="$2"
    local size="${SHOT_SIZE:-2254x1980}"
    local scale="${SHOT_SCALE:-2}"
    local width="${size%x*}"
    local height="${size#*x}"
    # Render at size/scale CSS pixels with a device scale factor of `scale`,
    # so the PNG stays ~`size` px wide while the page content is zoomed.
    local shot_w=$((width / scale))
    local shot_h=$((height / scale))
    local url="http://127.0.0.1:${PORT:-1111}${path}"

    mkdir -p "$(dirname "$out")"

    log_info "Shooting ${path} → $(dirname "$out")/$(basename "$out")"
    "$CHROMIUM" --headless=new --hide-scrollbars \
        "--force-device-scale-factor=${scale}" \
        "--window-size=${shot_w},${shot_h}" --virtual-time-budget=3000 \
        "--screenshot=${out}" "$url" >/dev/null 2>&1

    if [[ ! -s "$out" ]]; then
        log_err "Screenshot failed for ${path} (${out} is empty or missing)"
        return 1
    fi
    log_ok "${path} → ${out}"
}

run_screenshots() {
    ensure_zola
    ensure_bibinject
    run_build

    CHROMIUM="$(chromium_binary)" || {
        log_err "No Chromium-based browser found. Install chromium, chromium-browser,\n  google-chrome, or google-chrome-stable, then rerun."
        exit 1
    }
    log_ok "Using \"${CHROMIUM}\" for screenshots"

    local port="${PORT:-1111}"
    if ! http_server_available; then
        log_err "python3 with http.server is required to serve the build for screenshots."
        exit 1
    fi

    # Default page → output mapping (README demo images).
    local shots="${SHOT_PAGES:-/=website-demo.png /blog=blog-demo.png /research=research-demo.png}"

    ( cd ./public && exec python3 -m http.server "$port" >/dev/null 2>&1 ) &
    local serve_pid=$!
    trap 'log_warn "Stopping server (pid $serve_pid)..."; kill "$serve_pid" 2>/dev/null || true; exit 1' INT TERM
    sleep 2

    echo
    echo -e "${GREEN}${BOLD}Serving http://127.0.0.1:${port}/${RESET}"

    local rc=0
    local entry path out
    for entry in $shots; do
        path="${entry%%=*}"
        out="${entry#*=}"
        if [[ "$out" != /* ]]; then
            out="${SHOT_DIR}/${out}"
        fi
        screenshot_page "$path" "$out" || rc=1
    done

    kill "$serve_pid" 2>/dev/null || true
    trap - INT TERM

    if [[ "$rc" == 0 ]]; then
        log_ok "Screenshots saved under ${SHOT_DIR}"
    fi
    return "$rc"
}

# ============================================================
# Main
# ============================================================

MODE="build"

for arg in "$@"; do
  case "$arg" in
    --serve|-s)
      MODE="serve"
      ;;
    --screenshots|--shot)
      MODE="screenshots"
      ;;
    --help|-h)
      echo "Usage: $0 [MODE]"
      echo "  --serve, -s        watch-mode build (auto rebuild + BibInject, served locally)"
      echo "  --screenshots      build, serve locally, and screenshot the README demo pages"
      echo "                     (env: SHOT_SIZE=1503x1320, SHOT_SCALE=2, SHOT_PAGES=..., PORT=1111)"
      exit 0
      ;;
    *)
      log_err "Unknown argument: $arg"
      exit 1
      ;;
  esac
done

print_banner "$MODE"

case "$MODE" in
  serve)
    run_serve
    ;;
  screenshots)
    run_screenshots
    ;;
  *)
    run_build
    ;;
esac
