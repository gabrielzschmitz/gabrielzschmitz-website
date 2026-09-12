#!/usr/bin/env bash

set -euo pipefail

# ============================================================
# Install the pinned Zola binary for the Vercel build.
#
# Referenced from vercel.json's installCommand (kept short — Vercel rejects
# installCommand strings longer than 256 chars). Downloads the release
# tarball and refuses to extract until its SHA-256 matches the pinned value,
# so a tampered or compromised upstream release can never run code on the
# build (which has access to the project's env vars).
#
# The same URL/hash live in build.sh (ZOLA_URL / ZOLA_SHA256); keep them in
# sync when bumping ZOLA_VERSION.
# ============================================================

ZOLA_VERSION="v0.23.4"
ZOLA_URL="https://github.com/getzola/zola/releases/download/${ZOLA_VERSION}/zola-${ZOLA_VERSION}-x86_64-unknown-linux-musl.tar.gz"
ZOLA_SHA256="d99c51302ebbf909a0d83d4319d4d745b56a93dc49c4a69878c0f0dcaa4c8531"

archive="$(mktemp)"
trap 'rm -f "$archive"' EXIT

curl -fsSL "$ZOLA_URL" -o "$archive"

printf '%s  %s\n' "$ZOLA_SHA256" "$archive" | sha256sum -c - >/dev/null

tar xz -C /usr/local/bin -f "$archive"