# Manual offline / device-local storage test protocol

This project has no server and no sync: a report submitted on a phone
lives only in that phone's IndexedDB until the reporter explicitly
exports or shares it (see `docs/MANUSCRIPT_CHANGES.md`, Phase 7). That
claim can only be checked on a real device and a real browser — it is not
something a unit test can verify, since Vitest's `node` environment and
`fake-indexeddb` don't exercise a real browser's storage, service worker,
or network stack. Run this protocol on at least the devices/browsers the
manuscript claims support for, and record every trial in
`validation/results/offline_trials.csv`.

**AUTHOR ACTION REQUIRED**: these trials must be run on physical
hardware before submission — see `docs/AUTHOR_ACTION_REQUIRED.md`. This
file is the protocol only; nobody has executed it yet.

## Setup

1. Build and serve the production bundle (not the dev server, so the
   service worker behaves as it will for real users):
   ```
   cd nigerdelta-hsse-tracker/app
   npm run build
   npx serve ../  # or any static file server rooted one level up
   ```
2. Open the served URL in the browser under test.
3. Append `?mode=test` to the report URL so records created in this
   session are tagged `dataClass: "developer_test"` and can be told apart
   from real submissions afterward.

## Trial script

Run all of Steps 1-8 in one sitting per device/browser combination. Note
the exact device model, browser name and version, and OS in the CSV.

1. **First load, online.** Load the app fresh (clear site data first).
   Confirm the app shell renders and the service worker registers
   (check DevTools → Application → Service Workers).
2. **Go offline.** In DevTools, switch Network to "Offline" (or enable
   Airplane Mode on the device). Reload the page.
   - Expected: the app shell still loads fully from the cache. No blank
     screen, no "you are offline" browser error page.
3. **Submit a report while offline.** Fill in and submit a test report
   (include at least one photo). Confirm the success screen appears.
   - Expected: submission succeeds with no network request attempted —
     there is no sync/queue mechanism to fall back to, so this must work
     purely from local storage.
4. **Verify local persistence, still offline.** Open "My Submitted
   Reports". Confirm the new report is listed. Reload the page (still
   offline) and confirm it is still listed.
5. **Close and reopen, still offline.** Fully close the browser tab/app
   (or force-quit on mobile). Reopen it, still offline. Confirm the
   report is still present and its reference number matches Step 3.
6. **Verify integrity, still offline.** Open the report's detail view and
   run "Verify Integrity". Confirm it reports valid — this must work
   without any network access, since verification is purely local
   recomputation.
7. **Go back online.** Re-enable networking and reload.
   - Expected: nothing is auto-submitted or synced anywhere — the report
     stays exactly where it was, only reachable through this device's
     storage, until the reporter explicitly runs "Export for Submission".
     If anything makes a network request tied to the report at this
     point, that is a bug (the app claims no auto-sync).
8. **Export for Submission.** Run "Export for Submission" on the report
   and confirm a `.json` file downloads. Verify it independently with:
   ```
   python3 validation/verify_export.py path/to/downloaded-export.json
   ```
   - Expected: `PASS`.

## Recording results

For each device/browser combination, add one row per trial to
`validation/results/offline_trials.csv` with a pass/fail per step and any
notes (e.g. "step 2 failed on iOS Safari 17: blank screen offline").
A trial is only a pass overall if every step passes.
