# Macroeconomics Study Labs

Self-assessment labs for each lecture, published with GitHub Pages.

## Folder layout

```
index.html                         ← course home page (lists every lecture)
assets/
  lab.css                          ← shared design: colors, layout, mobile menu
  lab.js                           ← shared engine: lessons, questions, flashcards, quizzes, Write, Reflect
lectures/
  06-monetary-system/
    index.html                     ← small page that loads the engine + this lecture's content
    content.js                     ← lessons, graphics, questions, flashcards, short answers
  07-money-growth-inflation/
    index.html
    content.js
```

## Adding a new lecture

1. Copy an existing lecture folder, e.g. `lectures/07-money-growth-inflation/`, and rename it.
2. Replace `content.js` with the new lecture's content.
3. In the new `index.html`, change the `initLab({...})` settings. The `key` must be unique for each lecture, because it is where student progress is saved in the browser.
4. In the root `index.html`, add the lecture's `path`, `key` and number of lessons to the `LECTURES` list.

A fix made in `assets/lab.js` or `assets/lab.css` updates every lecture at once.
