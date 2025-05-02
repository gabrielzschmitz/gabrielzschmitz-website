+++
title = "Cryptography and the Quantum Problem"
description = "Why We Need Post-Quantum Cryptography"
date = '2025-05-01T13:30:39-03:00'
tags = [ 'Cryptography', 'Cybersecurity', 'Quantum Computing',
'Post-Quantum Cryptography', 'Mathematics', 'Digital Security', 'Education' ]
aliases = ["cryptography-and-the-quantum-problem"]
author = ["gabrielzschmitz"]
+++

![Post Header](/blog/posts/cryptography-and-the-quantum-problem/header.svg)
*Header image by [gabrielzschmitz](https://gabrielzschmitz.github.io),
licensed under [Creative Commons 4.0 Attribution license](https://creativecommons.org/licenses/by/4.0/).*

<br>

Cryptography is the cornerstone of modern digital security. From encrypted
messaging to blockchain and secure web browsing, the invisible machinery of math
keeps our data safe. But with the rise of quantum computing, the very foundation
of today’s encryption methods faces a serious threat.

Let’s explore what cryptography is, how it works, and why quantum computers
could break it --- unless we prepare now.

---

## What Is Cryptography?
### Keeping Messages Secure

[Cryptography](https://en.wikipedia.org/wiki/Cryptography) is the art of
protecting information through **mathematical transformations**. It ensures that
only the intended recipient can access a message’s contents, even if others
intercept it.

There are two major types of cryptography:

- **[Symmetric cryptography](https://en.wikipedia.org/wiki/Symmetric-key_algorithm)**:
    The same key is used to both encrypt and decrypt the message.
- **[Asymmetric cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography)**:
    Uses a pair of keys --- one public, one private.

Cryptography underpins much more than hidden messages. It enables secure
communications, digital signatures, and the backbone of technologies like
_blockchain_, _e-commerce_, and _VPNs_.

---

## A Classic Example: Caesar Cipher
### One of the First Ciphers in History

One of the simplest and oldest encryption techniques is the
[Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher).

Each letter in a message is **shifted** by a fixed number of positions in the
alphabet.
For example, with a key `k = 3`:

$$
\texttt{A} \rightarrow \texttt{D}, \quad \texttt{B} \rightarrow \texttt{E},
\quad \texttt{C} \rightarrow \texttt{F}, \quad \ldots
$$

So the message `ATTACK` becomes `DWWDFN`.

With today's computers, this cipher is extremely easy to break --- one only
needs to try all 26 letters of the alphabet. However, it still serves as a
useful introduction to basic encryption concepts such as:

- **Cipher key**, in this case _k = 3_;
- **Plaintext** and **ciphertext**, _ATTACK_ and _DWWDFN_ respectively.

---

## Diffie-Hellman
### How Two People Share a Secret in Public

While the Caesar cipher illustrates the basics of encryption, it lacks the
security needed for real-world communication. Modern systems require a way for
two people to **establish a shared secret key** --- even when communicating over
an insecure channel.

This raises an important question:  
**How can two people agree on a secret if everyone can hear their
conversation?**

This is exactly the problem that the **Diffie-Hellman key exchange** solves. It
allows two parties to create a **shared secret**, without ever sending the
secret itself.

To explain how this works, let’s start with a simple analogy using **colors**.

- Imagine Alice and Bob want to exchange a secret.
  - Alice chooses a secret color:
    <span style="color:red; font-weight:bold;">red</span>.
  - Bob chooses a different secret color:
    <span style="color:blue; font-weight:bold;">blue</span>.
  - They agree on a public base color:
    <span style="color:gray; font-weight:bold;">gray</span>.
- Each mixes their secret color with the public one and sends the result:
  - Alice sends a mixture of
    <span style="color:#c04040; font-weight:bold;">red + gray</span>
  - Bob sends a mixture of
    <span style="color:#4040c0; font-weight:bold;">blue + gray</span>
- Then, each mixes the received color with their own secret:
  - Alice mixes
    <span style="color:#4040c0; font-weight:bold;">(blue + gray)</span>
    with
    <span style="color:red; font-weight:bold;">red</span>
  - Bob mixes
    <span style="color:#c04040; font-weight:bold;">(red + gray)</span>
    with
    <span style="color:blue; font-weight:bold;">blue</span>
- The final result is the same shared color ---
  <span style="color:#a02060; font-weight:bold;">a shared secret key</span>
  --- but anyone observing the
  exchanged colors can't reconstruct it without knowing the secrets.

![Diffie-Hellman as Colors](/blog/posts/cryptography-and-the-quantum-problem/diffie-hellman-as-colors.png)
*Diffie-Hellman as Colors Scheme by [gabrielzschmitz](https://gabrielzschmitz.github.io),
licensed under [Creative Commons 4.0 Attribution license](https://creativecommons.org/licenses/by/4.0/).*

---

## Diffie-Hellman with Modular Arithmetic  
### Turning Colors into Numbers

Now let’s translate the color analogy into **mathematical operations** --- this
is where the real magic of Diffie-Hellman happens.

In the previous example, Alice and Bob created a shared color without ever
revealing their secret colors. The same principle can be achieved with numbers
using **modular arithmetic**, which is like working on a circular number line
--- much like a clock.

For example:

$$
10 + 5 \equiv 3 \pmod{12}
$$

This "modulo" operator keeps values within a fixed range, which prevents
attackers from deducing secrets even when partial information is shared.

---

### How the Protocol Works

1. **Public parameters** are agreed upon:
   - A base number `g` (generator)
   - A large prime number `p` (modulus)

2. **Alice and Bob choose private numbers**:
   - Alice chooses a secret number `a`
   - Bob chooses a secret number `b`

3. **They generate public values** using modular exponentiation:

$$
A = g^a \pmod{p}
$$
$$
B = g^b \pmod{p}
$$

4. **They exchange** `A` and `B` over an open channel.

5. **They each compute the same secret key**:

$$
\text{Alice: } K = B^a \pmod p = g^{ba} \pmod p
$$
$$
\text{Bob: } K = A^b \pmod p = g^{ab} \pmod p
$$

as:

$$
g^{ab} = g^{ba}
$$

Both parties arrive at the same shared key --- just like the shared color in the
metaphor --- even though their private values remain hidden.

---

## Security Through Discrete Logarithms  
### Why Diffie-Hellman Is Hard to Crack

Now that we’ve seen how Alice and Bob generate a shared secret, let’s explore
**why an attacker can’t just reverse the process**.

Even though the values `g`, `p`, `A`, and `B` are publicly visible, the attacker
still doesn’t know the private values `a` or `b`.

Why can’t they just compute them?

Because doing so would require solving the
[**discrete logarithm problem**](https://en.wikipedia.org/wiki/Discrete_logarithm)
--- finding `a` such that:

$$
A = g^a \pmod{p}
$$

This problem is **computationally hard** for large enough values of `p`. There’s
no efficient shortcut to reverse modular exponentiation without knowing the
secret exponent. In fact:

- For modern key sizes, it would take longer than the **age of the universe**
  using today’s best classical algorithms.

> “Or would it?”

This question marks a turning point.

Enter quantum computing.

---

## The Quantum Problem
### Breaking Today’s Cryptography

<div style="text-align: center; margin: auto">
  <img
    src="/blog/posts/cryptography-and-the-quantum-problem/computador-quantico.png"
    alt="Quantum Computer"
    height="500">
  <div><em>Google’s Quantum Computer</em></div>
</div>

Quantum computers can **solve discrete logarithms exponentially faster** than
classical ones using
[**Shor’s Algorithm**](https://en.wikipedia.org/wiki/Shor's_algorithm).

That means encryption schemes like _RSA_, _Diffie-Hellman_, and _ECC_ --- the
bedrock of internet security --- could be broken in minutes by a powerful
quantum machine.

We don’t yet have large-scale quantum computers. But when they arrive, most of
our current cryptographic infrastructure will become obsolete.

---

## Why We Need Post-Quantum Cryptography?

**Post-Quantum Cryptography (PQC)** is about building encryption systems that
resist attacks from quantum computers.

Instead of relying on problems like factoring or discrete logs, PQC is based on:
- **Lattices**
- **Hash-based constructions**
- **Multivariate polynomials**
- **Code-based systems**

These problems remain hard even for quantum machines.

Institutions like
[**NIST**](https://csrc.nist.gov/Projects/post-quantum-cryptography)
are already evaluating and standardizing PQC algorithms to ensure future-proof
digital security.

---

## Conclusion

Cryptography has come a long way --- from Caesar's ciphers to internet-scale
encryption. But a new challenge looms: the quantum computer.

If we want to preserve privacy, trust, and security in the digital age, we must
act now to **transition to post-quantum cryptography**.

The future isn’t just encrypted. It’s quantum-resistant.

---

Stay tuned for more insights as we continue to explore the fascinating
intersection of mathematics, technology, and security.

<br>

\- *gabrielzschmitz*
