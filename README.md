# Personal Website

<img align="right" width="166px" src="./static/assets/images/logo.svg" alt="gabrielzschmitz Logo">

<a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
<a href="https://www.buymeacoffee.com/gabrielzschmitz" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 20px !important;width: 87px;" ></a>
<a href="https://github.com/gabrielzschmitz/gabrielzschmitz-website"><img src="https://img.shields.io/github/stars/gabrielzschmitz/gabrielzschmitz-website?style=social" alt="Give me a Star"></a>

This repository contains the full source code for my personal website. It is
built as a **single [Zola](https://www.getzola.org/) site** that serves both
the handcrafted **portfolio main page** at `/` and the **blog** at `/blog`,
where all long-form writing and technical posts live.

## Overview


#### Main Page (`/`)

<p align="center">
    <img align="center" width="640px" src="./static/assets/images/website-demo.png" alt="Website Demonstration">
</p>


#### Blog (`/blog`)

<p align="center">
    <img align="center" width="640px" src="./static/assets/images/blog-demo.png" alt="Blog Demonstration">
</p>

## Build

The site is built with **[Zola](https://www.getzola.org/)** and research
references are injected at build time by
**[BibInject](https://github.com/gabrielzschmitz/BibInject)**.

### Requirements

- **Zola** — auto-downloaded on first build (or provide `zola` on `PATH`).
- **Python 3** with `venv` support — used by BibInject to create its virtual
  environment. On Debian/Ubuntu you may need
  `sudo apt install python3-venv`.

### Building for production

```sh
./build.sh
```

This runs `zola build` and then calls BibInject to fill the two reference
targets:

- the **research index** (`/research`) — built-in `apa` refspec;
- the portfolio sidebar **Index of Research** panel (`/`) — custom
  `mini` refspec (overlaid from `static/refspec/mini.html`).

The generated site is written to `./public`.

### Development (watch mode)

```sh
./build.sh --serve
```

Rebuilds and re-injects on every change and serves the result locally
(default port `1111`).

### BibInject

BibInject is fetched from its GitHub release tarball (pinned version in
`build.sh`) into a cache dir (default `/tmp/BibInject-<version>`). Each run
copies the repo's `static/refspec/mini.html` over the cached `mini` refspec so
the sidebar layout stays in sync. If your environment cannot create the venv
(e.g. `python3-venv` missing), point `BIB_DIR` at a ready clone, for
example:

```sh
BIB_DIR=/tmp/BibInject ./build.sh
```

## License

This project is licensed under the MIT License, but the images are licensed
under the Creative Commons Attribution 4.0 License. See the [LICENSE](LICENSE)
file
for details.
