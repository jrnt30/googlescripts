# Overview
Set of utility functions to be used with [Google Scripts](https://script.google.com/home) and deployed using [Google's Clasp tool](https://github.com/google/clasp/tree/master/docs)

## Function Reference
### email/archiver.ts#emailArchiver
This is based upon the [Gist](https://gist.github.com/akamyshanov/88e0bfa936296d14febe4cb7d5c37c78) from [This post about Google Scripts](https://medium.com/@fw3d/auto-archive-emails-in-gmail-after-2-days-1ebf0e076b1c).

It's responsibility is to:
- Look for Google email threads in your Inbox that include the `auto-archive` label.
- It will then attempt to find a `retention/<N>` tag on the threads
- If the thread's last activity is older than `<N>` days ago, it will then archive your message.

#### Example Usage:
- I have created 2 filters for `from: noreply@medium.com` in my Google account.
  - The first filter adds the `auto-archive` label
  - Second filter add `retention/7` label
- Scheduled the execution of the `emailArchiver` function to run with a Daily Trigger.  This can be done by opening the `Project Overview` clicking on the `...` under `Project Details` -> `Triggers` -> `+ Add Trigger` in the lower right

## NOTEs:
- I don't think it's possible to apply 2 labels to the messages as they come in with one filter.  The API does allow one to lookup all of the `GmailLabel`s a user has on their account, this would be another way of handling this processing
- Arrays (ex: `GmailLabels[]`) in the Script Console seems to be missing the `find` method.
- [Clasp's](https://github.com/google/clasp/issues/67) `.claspignore` does not seem to do the trick of properly respecting/ignoring the files we would like, hence the `npm run push` hack

## TODOs
- Find a way to create helper functions that will not interfere with the processing
  - Create a `groupBy` function for arrays to allow for easier GmailThread => ThreadsByLabel map