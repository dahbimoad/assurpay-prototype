# AssurPay · prototype

Clickable prototype of AssurPay, the register for insurance agencies: every policy validated on the insurer's portal is recorded automatically, along with who did it, at what time, how much was taken from the client, and what is still owed.

All data is fictitious and stays in your browser.

## Links

| What | Link |
| --- | --- |
| **Live app** | https://dahbimoad.github.io/assurpay-prototype/ |
| **DOM inspector** (copy-paste page) | https://dahbimoad.github.io/assurpay-prototype/tools/dom-inspector.html |
| DOM inspector (raw script) | https://dahbimoad.github.io/assurpay-prototype/tools/dom-inspector.js |
| Review notes file | https://github.com/dahbimoad/assurpay-prototype/blob/main/notes.json |
| Main HTML file | [`index.html`](index.html) |

> **Note:** the live links above are served by GitHub Pages from the `main` branch. New work lives on a feature branch first, so a link 404s until that branch is merged into `main`.

## Demo accounts

| Role | Login | Password |
| --- | --- | --- |
| Administrator (manager) | `admin` | `admin123` |
| Collaborator | `collab` | `collab123` |

Open two tabs (one per account) to watch notifications arrive live. **"Réinitialiser la démo"** on the login page restores the starting data.

## Review notes (feedback on every screen)

Every screen has a yellow **Notes** tab on the right edge (keyboard shortcut: **N**) for writing down what needs to change. A note can be pinned to a precise element, which drops a numbered marker on it.

- Notes are saved **instantly in the browser**, then committed to [`notes.json`](notes.json) on `main`, so they appear on **every device**.
- **Anyone can read** the notes. To **write** them to the repo from a device, open the panel's settings once and paste a GitHub **fine-grained token** limited to this repository with **Contents: Read and write**. The token stays in that browser and is never published.
- The notes are separate from the demo data — **"Réinitialiser la démo" does not erase them.**
- You can export all notes as a Markdown checklist from the panel.

## DOM inspector (for building the capture extension)

To build the browser extension that reads the insurer portal at validation time, we first need an accurate map of that page's fields, buttons and tables.

**Easiest way — the copy-paste page:**
https://dahbimoad.github.io/assurpay-prototype/tools/dom-inspector.html

1. Open the page, click **"Copier le script"**.
2. Go to the **insurer portal tab** (the new-attestation form) and open the console (`F12` → **Console**).
3. Paste the script and press **Enter**.
4. It prints a structured report of the page's forms, fields, buttons and tables, and copies it to your clipboard. Paste that back so the extension is built against the real DOM.

The script **only reads** the page: it sends nothing, changes nothing, and never includes password fields. Raw file: [`tools/dom-inspector.js`](tools/dom-inspector.js).

**Firefox notes:**
- The **first time** you paste into the console, Firefox asks you to type `allow pasting` and press Enter. Do it once, then paste the script.
- The auto-copy to clipboard may not fire from the console (Firefox only allows it on a real click). If so, the full report is still printed in the console — select and copy it manually. Using the copy-paste page above avoids this, since its button is a real click.

## Running locally

It is a single static file. Either open `index.html` directly in a browser, or serve the folder:

```
python3 -m http.server
```

then visit `http://localhost:8000/`.

## Roadmap — capture extension

Next step is a browser extension that, when an insurance is validated on the insurer portal, **captures the details and sends them to the admin's server**. That requires a backend endpoint to receive the data (the prototype currently has no server — review notes are stored in `notes.json` via GitHub). The endpoint's address and shape need to be decided before the send-to-server flow is built.
