+++
title = "Starting a new project"
description = "A sneek peek at Axiom Nexus"
date = "2025-04-01"
tags = ['Mathematics', 'Golang', 'HTMX', 'PostgreSQL', 'Open Source',
'Education']
aliases = ["starting-new-project"]
author = ["gabrielzschmitz"]
+++

![Post Header](/blog/posts/starting-a-new-project/header.svg)
*Header image by [gabrielzschmitz](https://gabrielzschmitz.github.io),
licensed under [Creative Commons 4.0 Attribution license](https://creativecommons.org/licenses/by/4.0/).*

<br>

Mathematics is an interconnected web of concepts, theorems, and proofs, each
building upon others in intricate ways. But what if there were a structured,
searchable way to navigate this vast landscape? That’s the idea behind my latest
project: **Axiom Nexus**, or for short, **AxioN**.

## The Vision

The goal is to create an online resource where users can:

- Search for **mathematical concepts**, **theorems**, **definitions**, and
  **proofs**.
- View **relationships between topics** using **tags** to get that distances.
- Export expressions and code in multiple formats (e.g., LaTeX, Unicode, etc).
- Get good references and explanations.

In essence, this platform aims to be more than just a collection of
definitions -- it should serve as a dynamic tool for understanding mathematical
structures and relationships.

## The Name Choice: Axiom Nexus (AxioN)

An **axiom** is a fundamental truth upon which mathematical structures are
built. A **nexus** is a hub of connections, linking different entities together.
Combining these ideas, **Axiom Nexus (AxioN)** represents a **centralized hub
for mathematical knowledge**, where foundational truths interconnect with
theorems, definitions, and proofs. The short form, **AxioN**, cleverly echoes
the idea of axioms while maintaining a sleek and memorable identity.

## Technical Choices

To ensure simplicity, scalability, and usability, I’ve chosen a carefully
designed stack that aims to balance efficiency with ease of use:

### Backend: Golang

**Golang** is a fast, compiled language that excels at handling concurrent tasks
efficiently. By using Golang for the backend, the system can handle multiple
requests seamlessly, ensuring a smooth user experience even as the database
grows. Its robust standard library and simplicity in deployment should make it a
great choice for the project.

### Frontend: HTMX

Instead of using a complex frontend framework, I opted for **HTMX**, a
lightweight JavaScript alternative that allows for dynamic content updates
without the need for a full-page reload. This keeps the interface responsive and
interactive while maintaining simplicity. HTMX enables features like infinite
scrolling, inline content updates, and lazy loading, all without writing large
amounts of JavaScript.

### Database: PostgreSQL

To handle structured mathematical data efficiently, **PostgreSQL** serves as the
primary database. It offers:

- **Scalability:** Handles large datasets with ease.
- **Complex Queries:** Ideal for linking mathematical concepts and exploring
  relationships through graph-like structures.
- **ACID Compliance:** Ensures reliability and consistency in stored data.

With PostgreSQL, the system can efficiently manage theorem dependencies, search
queries, and user contributions.

### Data Format: YAML Files

Each mathematical concept, theorem, or proof is described using **YAML** files.
This choice was made to prioritize **readability** and **ease of contribution**.
YAML is human-friendly and allows for:

- **Structured data representation** without excessive complexity.
- **Simple version control**, making it easy to track changes and updates.
- **User contributions**, as anyone can edit or add new mathematical entries
  without needing database access.

### Code Rendering: highlight.js

For examples that involve programming or pseudo-code, **highlight.js** ensures
proper syntax highlighting. Whether it’s Python, C++, or LaTeX-formatted proofs,
this makes code snippets easy to read and understand.

### Mathematical Notation: MathJax

Since mathematics relies heavily on proper notation, **MathJax** is used for
rendering LaTeX equations. This ensures:

- **High-quality mathematical typography**, making proofs and equations clear.
- **Browser compatibility**, so users can view complex formulas without
  additional software.
- **Support for interactive content**, allowing users to copy and manipulate
  formulas directly from the interface.

## Current Status

Right now, the project is in its early stages. I’m focusing on:

- **Structuring the database** to store mathematical information efficiently.
- **Designing an intuitive search mechanism** to help users find what they need.
- **Implementing tagging and connections** so that related ideas naturally link
  together.

## Why This Matters

Many existing resources present mathematics in a linear, textbook-like format.
But real mathematical thinking isn’t linear -- it’s a web of interconnected
ideas. By structuring knowledge in a way that mirrors how mathematicians think,
this project could help students and researchers explore mathematics more
intuitively.

---

This is just the beginning, and I’m excited to see where this journey leads. If
you have ideas or want to contribute, stay tuned for updates!

<br>

\- _gabrielzschmitz_
