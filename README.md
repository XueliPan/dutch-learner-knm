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

The importer also reads `/Users/sherrypan/Downloads/KNM_study_guide_CN_NL.md` when present, adding guide vocabulary, 80 guide questions, grammar cards, and the one-page pre-exam cheat sheet.

## Notes

- The mock question bank includes the two provided DUO oefenexamen PDFs plus original expansion questions.
- The mock exam mode draws 40 questions for a 45-minute session, matching the KNM practice rhythm.
- Progress is stored locally in the browser with `localStorage`.
- Dutch pronunciation audio uses the browser's built-in Web Speech API when available, with a Google Translate TTS audio fallback for browsers that do not expose native speech synthesis.
