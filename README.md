# AssurPay · prototype

Clickable prototype of AssurPay, the register for insurance agencies: every policy validated on the insurer's portal is recorded automatically, along with who did it, how much was taken from the client and what is still owed.

**Live version: https://dahbimoad.github.io/assurpay-prototype/**

All data is fictitious and stays in your browser.

## Demo accounts

| Role | Login | Password |
| --- | --- | --- |
| Administrator (manager) | `admin` | `admin123` |
| Collaborator | `collab` | `collab123` |

Open two tabs (one per account) to watch notifications arrive live. "Réinitialiser la démo" on the login page restores the starting data.

## Review notes

Every screen has a yellow **Notes** tab on the right edge (shortcut: **N**) for writing down what needs to change, optionally pinned to a precise element.

- Notes are saved instantly in the browser, then committed to [`notes.json`](notes.json) on `main`, so they appear on every device.
- Anyone can read them. To write them to the repo from a device, open the panel settings once and paste a GitHub fine-grained token limited to this repository with **Contents: Read and write**.
- Resetting the demo does not touch the notes.

## DOM inspector (for building the capture extension)

To build the extension that reads the insurer portal at validation time, we first need an accurate map of that page's fields, buttons and tables.

- **Copy-paste page:** https://dahbimoad.github.io/assurpay-prototype/tools/dom-inspector.html
- **Raw script:** [`tools/dom-inspector.js`](tools/dom-inspector.js)

Open the portal page, open the console (`F12` → Console), paste the script, press Enter. It prints a structured report and copies it to your clipboard — paste that back so the extension is built against the real page. The script only reads the page: it sends nothing and changes nothing, and it never includes password fields.

## Running locally

It is a single static file: open `index.html` in a browser, or serve the folder (for example `python3 -m http.server`).
