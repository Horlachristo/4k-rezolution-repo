# 4K Rezolution

Public brand site + a shared Media & Publicity Office dashboard for the committee.

```
4k-rezolution/
├── index.html          ← public site (home)
├── css/, js/            ← public site styles/scripts
└── office/               ← private-ish committee dashboard
    ├── index.html
    ├── css/
    └── js/
        ├── app.js               ← dashboard logic (Firebase)
        └── firebase-config.js   ← your Firebase keys go here
```

---

## Part 1 — Push this to GitHub (using VS Code)

1. Open this folder in VS Code (`File → Open Folder`).
2. Click the **Source Control** icon in the left sidebar (looks like a branch).
3. Click **Publish to GitHub**. If prompted, sign in to GitHub through VS Code.
4. Choose **Publish to GitHub public repository** (or private — see note below) and name it `4k-rezolution`.
5. VS Code will create the repo, commit everything, and push it. Done.

**From now on:** after making changes, use Source Control → type a message → ✓ **Commit** → **Sync Changes** to push updates.

### Turn on GitHub Pages (to get a live URL)

1. On GitHub.com, open your new repo → **Settings** → **Pages**.
2. Under "Build and deployment," set **Source** to `Deploy from a branch`, branch `main`, folder `/root`.
3. Save. After a minute, your site is live at:
   `https://YOUR-USERNAME.github.io/4k-rezolution/`
   and the dashboard at:
   `https://YOUR-USERNAME.github.io/4k-rezolution/office/`

> ⚠️ **Note:** GitHub Pages is public hosting. The `/office/` page isn't linked from the public nav, but the URL isn't secret either. That's exactly why Part 2 adds real sign-in — so even if someone finds the link, they can't read or edit anything without signing in.

---

## Part 2 — Connect Firebase (makes the dashboard shared + live)

This gives your committee one shared dashboard instead of everyone having their own separate local copy, with Google sign-in required to view or edit.

### A. Create the Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. Name it (e.g. `4k-rezolution`) → you can disable Google Analytics → **Create project**.

### B. Turn on Firestore (the database)
1. In the left menu: **Build → Firestore Database → Create database**.
2. Choose a region close to you → start in **production mode**.

### C. Turn on sign-in
1. **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Google**.

### D. Get your web app config
1. Click the **gear icon → Project settings**.
2. Scroll to "Your apps" → click the **</>** (web) icon → register an app (any nickname).
3. Copy the `firebaseConfig` object it shows you.
4. Paste those values into `office/js/firebase-config.js` in this project, replacing the placeholders.

### E. Set Firestore security rules
In Firestore → **Rules** tab, replace the contents with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This means: **only signed-in users can read or write** — anyone else gets nothing. Click **Publish**.

> To restrict it further to only your committee's school emails, you can change the condition to something like:
> `allow read, write: if request.auth != null && request.auth.token.email.matches('.*@yourschool[.]edu$');`

### F. Commit and push
Save `firebase-config.js`, then commit and push through VS Code's Source Control panel (see Part 1). Once GitHub Pages redeploys, open `/office/`, sign in with Google, and everything you add will sync live for anyone else signed in.

---

## Local development
Right-click `index.html` (or `office/index.html`) in VS Code → **Open with Live Server** to preview with auto-reload before pushing.
