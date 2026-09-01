# Personal Website

<img align="right" width="192px" src="./assets/images/logo.svg" alt="gabrielzschmitz Logo">

<a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
<a href="https://www.buymeacoffee.com/gabrielzschmitz" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 20px !important;width: 87px;" ></a>
<a href="https://github.com/gabrielzschmitz/gabrielzschmitz.github.io"><img src="https://img.shields.io/github/stars/gabrielzschmitz/gabrielzschmitz.github.io?style=social" alt="Give me a Star"></a>

This repository contains the full source code for my personal website. It is
built as a **single [Zola](https://www.getzola.org/) site** that serves both the
handcrafted **portfolio landing page** at `/` and the **blog** at `/blog`, where
all long-form writing and technical posts live. The landing page is a custom
template that pulls in the latest posts, blending a handcrafted front page with
Zola’s fast, flexible content system.

## Overview


* **Landing Page (`/`)**

  * Handcrafted **HTML**, **CSS**, and **JavaScript**, exposed as a Zola
    template (`templates/index.html`) and content section (`content/_index.md`)
  * The *From the Blog* sidebar box renders the latest 3 blog posts
  * Static assets grouped under `static/assets/` → `css/`, `js/`,
    `images/`, `certificates/`, `resume/`

<p align="center">
    <img width="640px" src="./static/assets/images/website-demo.png" alt="Website Demonstration">
</p>


* **Blog (`/blog`)**

  * Built with **Zola**, served under `/blog`
  * Markdown posts in `content/blog/posts/`
  * Minimal custom templates in `templates/`
  * Blog styling in `static/blog/blog.css` (style it yourself)
  * Build output in `public/`
  * Configured via `config.toml`

<p align="center">
    <img align="center" height="640px" src="./static/assets/images/blog-demo.png" alt="Blog Demonstration">
</p>

* **Extras**

  * Resume (`static/assets/resume/resume.pdf`, `static/assets/resume/curriculo.pdf`)
  * Certificates (`static/assets/certificates/`)
  * Under-construction page (`static/under-construction.html`)

## License

This project is licensed under the MIT License, but the images are licensed
under the Creative Commons Attribution 4.0 License. See the [LICENSE](LICENSE)
file
for details.
