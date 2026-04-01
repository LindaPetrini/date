# E2E Test Results — date.lindapetrini.com

**Date:** 2026-03-31
**Environment:** Headless Chromium via gstack browse

---

## 1. Page Loads

**PASS (with issues)**

- Page loads with HTTP 200
- All toys render (32 toys found)
- JS console errors:
  - `Failed to load resource: 404` — `assets/linda.jpg` (see details below)
  - `THREE.WebGLRenderer: Error creating WebGL context` — expected in headless, but **unhandled error crashes init chain** (see bug in test 6)

**BUG: `assets/linda.jpg` returns 404.**
The file is tracked in git as `assets/linda.JPG` (uppercase `.JPG`) but referenced in HTML as `assets/linda.jpg` (lowercase). GitHub Pages is case-sensitive. All other images (`linda2.jpg`, `linda3.jpg`, `linda4.jpg`, textures) load fine.

**Fix:** Rename the file in git: `git mv assets/linda.JPG assets/linda.jpg`

---

## 2. Umami Tracking

**PASS**

Analytics script is present in page source:
```html
<script defer src="https://analytics.lindapetrini.com/script.js" data-website-id="9015af2c-b60e-4397-acb4-46bf860991f2"></script>
```

---

## 3. Travel + Location Toy

**PASS**

- Travel toy renders as toy #3 with 5 options (across town / a couple hours away / another city, sure / another country, why not / anywhere on the planet)
- Clicked "another city, sure" — button selected successfully
- Location text field present with placeholder "city, country, or continent"
- Filled "Berlin, Germany" — accepted

---

## 4. Shades Toy Position

**PASS**

Toy order verified:
- Toy #3: "how far would you travel for a first date?" (travel)
- Toy #4: "order these by hue" (shades)

Shades appears immediately after travel as expected.

---

## 5. Subtitle Text

**PASS**

Subtitle reads exactly:
> date me docs are boring. here's a playground instead (I'll still read yours though).

---

## 6. Share Form

**PASS (with caveats)**

After clicking "share your answers with me", the form contains:
- Photo upload button: styled as "+ choose a photo" (not native file input) — **PASS**
- Voice note recorder: "record" button present — **PASS**
- Name field: placeholder "your name" — **PASS**
- Email field: placeholder "your email" — **PASS**
- Message field: placeholder "anything else you want to say..." — **PASS**
- Send button: text says "send" (not "open email client") — **PASS**
- Privacy/data note: "your answers, photo, and voice note will be sent directly to linda. or copy to clipboard and send however you like." — **PASS** (it's a data handling note, though not labeled "privacy")

**BUG: Share form toggle broken when WebGL is unavailable.**
`initUntangle()` (called before `initShare()` in the init chain) crashes on `new THREE.WebGLRenderer()` when WebGL is unsupported. The unhandled error prevents `initShare()` from ever running, so the toggle button and form submit listener are never attached. This affects headless browsers and any device without WebGL.

**Fix:** Wrap the WebGL code in `initUntangle()` with a try-catch:
```js
try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // ... rest of Three.js code
} catch(e) {
    console.warn('WebGL not available, skipping 3D knot');
}
```

---

## 7. Compatibility Score

**PASS**

After answering some toys, the results card shows:
- Title: "the wanderer"
- Score: "60% compatibility with linda"
- Disclaimer: "best guess -- still calibrating" — **present and correct**

Screenshot: `/tmp/dating-results-card.png`

---

## 8. Form Submission Test

**PASS** (tested two ways)

**Via curl (direct API):**
```
POST https://dateme-api.lindapetrini.com/api/submit
Response: {"ok": true, "email_sent": true, "note": null}
```

**Via browser (after manually calling initShare):**
- Filled name: "E2E Test", email: "e2e@test.com", message: "automated test - with listener"
- Network shows: `POST https://dateme-api.lindapetrini.com/api/submit -> 200 (1894ms)`
- Form response: "sent! thanks for sharing."
- Send button changed to: "sent"

Note: In-browser form submission only works after manually calling `Playground.initShare()` due to the WebGL bug described in test 6. With the bug fixed, it would work normally.

---

## 9. API Health

**PASS**

```
GET https://dateme-api.lindapetrini.com/api/health
Response: {"ok": true, "service": "dateme-api"}
```

---

## 10. CSV Endpoint

**PASS**

```
GET https://dateme-api.lindapetrini.com/api/submissions.csv (auth: admin:dateme2026)
```

Returns CSV with headers and submission data. Latest E2E test submission visible:
```
23355439,2026-04-01 10:36,E2E Test,e2e@test.com,automated test,False,False,,,,,,
```

---

## Summary

| # | Test | Result |
|---|------|--------|
| 1 | Page loads | PASS (with issues) |
| 2 | Umami tracking | PASS |
| 3 | Travel + Location toy | PASS |
| 4 | Shades toy position | PASS |
| 5 | Subtitle text | PASS |
| 6 | Share form | PASS (with bug) |
| 7 | Compatibility score | PASS |
| 8 | Form submission | PASS |
| 9 | API health | PASS |
| 10 | CSV endpoint | PASS |

## Bugs Found

1. **`assets/linda.jpg` 404** — File tracked as `linda.JPG` (uppercase) but referenced as `linda.jpg` (lowercase). Case-sensitive deployment breaks it.

2. **WebGL crash breaks share form init** — Unhandled error in `initUntangle()` when `THREE.WebGLRenderer()` fails prevents `initShare()` from running. The share form toggle and submit handler are never attached. Affects any browser without WebGL support.

## Screenshots

- `/tmp/dating-page-load.png` — Full page on load
- `/tmp/dating-travel-toy.png` — Travel toy with selection
- `/tmp/dating-results-card.png` — Compatibility card with disclaimer
- `/tmp/dating-form-filled.png` — Form with test data
- `/tmp/dating-form-success.png` — Successful submission
