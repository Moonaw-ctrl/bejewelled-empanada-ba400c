# Wedding Invitation

An interactive Arabic wedding invitation for Omar and Ghina, prepared as a shareable website that can be opened from any browser.

## Technologies

- Semantic HTML
- Responsive CSS with animated envelope and decorative effects
- Vanilla JavaScript for opening the invitation
- Netlify static hosting

## Run locally

Serve the `public` directory with any static file server, or use Netlify Dev:

```bash
netlify dev --port 8889
```

Then open `http://localhost:8889`.


### Personalized invitations

Open `/invite-links.html` to enter each pair of guest names and copy their personal invitation URL. The invitation displays these names and pre-fills the attendance form. The names in these URLs are visible to anyone receiving the link; they are personalization, not access credentials. Guests can correct the names before confirming, including leaving the second name empty when attending alone.

### Attendance and Google Sheets

Attendance confirmations are stored in Netlify Database. A checked acknowledgement and the submit button are both required. The server validates names and stores each submission ID once, allowing safe retries. No guest list is exposed through a public API.

The destination is the supplied Google Sheet. A sharing link alone does not authorize writing to a Google account. To activate automatic updates:

1. In that Google Sheet, open **Extensions > Apps Script**, paste `scripts/google-sheets.gs`, and save.
2. In Apps Script **Project Settings > Script Properties**, add `RSVP_TOKEN` with a newly generated private random value.
3. Deploy the script as a **Web app**, execute as the sheet owner, allow **Anyone** access, and authorize its spreadsheet access. The script checks the private token before accepting any response.
4. Set Netlify runtime environment variables `GOOGLE_SHEETS_WEBHOOK_URL` to the deployed `/exec` URL and `GOOGLE_SHEETS_WEBHOOK_TOKEN` to the same private value, using the provider dashboards. Never put the private value into source files or invitation links. Redeploy after configuring.

The integration writes to the **Guests** tab (falling back to the supplied tab with ID 0, or creating **Guests** if neither exists). Rows contain both guest names, adult attendance count, confirmation, submission time, and a unique response ID. Google Sheets can export this as Microsoft Excel. New responses attempt synchronization immediately; a scheduled task retries unsynced records every five minutes on published production deploys. Responses remain saved while the Google connection is unconfigured or unavailable. Duplicate delivery is checked by ID in the script under a lock. Spreadsheet formula prefixes in names are escaped.

For a manual end-to-end check after deploy, submit one personalized invitation, confirm the success message, and check the Guests tab for a single row with matching names. Repeated delivery of the same response ID must leave a single row. Automated schema migrations are applied by Netlify at deployment, not from local scripts.

If an older version of the Apps Script was already deployed, replace its code and update the existing web app deployment to a new version. Saving the script alone does not update the deployed webhook. Without the webhook URL and matching private token configured in Netlify, confirmations stay in Netlify Database and cannot appear in Google Sheets. Once connected, pending responses are retried automatically.
