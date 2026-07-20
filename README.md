# KNM Chinese Study App

A lightweight browser app for Chinese speakers preparing for the Dutch KNM exam.

## Run

Start a local server:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Update KNM Content

The app imports structured lessons, questions, vocabulary, and the 7-day plan from the KNM Markdown files in iCloud:

```bash
node scripts/import-knm-content.mjs
```

## Notes

- Practice questions are original study material, not official DUO exam questions.
- The app links to DUO official practice exams for final exam familiarization.
- Progress is stored locally in the browser with `localStorage`.
- Dutch pronunciation audio uses the browser's built-in Web Speech API when available, with a Google Translate TTS audio fallback for browsers that do not expose native speech synthesis.
