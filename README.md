# DoubtBook — Personal version

## New in this version
- First launch asks for the student's name.
- The dashboard greets the signed-in student by name.
- Logout returns to the name-entry screen but does not delete saved doubts.
- Doubts can include typed text, an uploaded/taken question photo, or both.
- Add a question number/reference (for example, Exercise 3.2, Q. 7).
- Images are resized/compressed in the browser before being saved.

## Original seven features
1. Add Doubt
2. Subject Categories
3. Chapter Selection
4. Status Tracking: Unsolved, Attempted, Resolved
5. Revision Section
6. Search
7. Analytics

## Storage and privacy
Everything is stored locally in this browser using LocalStorage. There is no Firebase, Supabase, backend, account server or cross-device sync. Each browser/device has its own data. Logging out does not erase saved doubts. Clearing browser site data may erase them. Large numbers of photos can use browser storage, so images are compressed before saving.

## Installable app
This is a PWA. Publish to GitHub Pages over HTTPS, then open the site and choose Install app (if shown) or use the browser menu → Install app / Add to Home Screen. The service worker enables offline loading after the first successful visit.

## GitHub Pages
Extract the ZIP and upload the *contents* of the `DoubtBook` folder to the repository root. Keep `index.html`, `app.js`, `style.css`, `manifest.webmanifest`, `sw.js` and `assets/` together.


## Additional tools
- Edit saved doubts, including attached images and revision dates.
- Filter doubts by subject.
- Revision Calendar lists doubts by their selected revision date.
- Backup downloads a JSON file containing doubts and embedded images.
- Restore imports a DoubtBook JSON backup after confirmation, replacing the current doubt list.
