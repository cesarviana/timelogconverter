# timelogconverter
This repository converts [TogglTrack](https://toggl.com/track/) entries to a new format.

0. Install [toggle extension](https://chrome.google.com/webstore/detail/toggl-track-productivity/oejgccbfbmkkpaidnkphaiaecficdnfn)
1. Track time

First entry for the story:
- Start a new story entry using "Start time" button in Shortcut. 
- Add the related tags (bug, feature, or chore)

New entries: 
- Find a previous entry on toggl and click on it. Then hit start. In this way the previous added tags are re-used.

https://github.com/cesarviana/timelogconverter/assets/6049357/b61c23c8-51e3-4451-ac30-15cd767d3fb7

2. Export toggl "Detailed" time entries

https://github.com/cesarviana/timelogconverter/assets/6049357/0683517e-5389-4eaf-bfa8-01cc8d8fa1e2

3. Install dependencies
Go to this folder and run `yarn`

5. Convert
`node index.js <toggl.csv>`
It produces an `output.csv` file. Copy and paste.

https://github.com/cesarviana/timelogconverter/assets/6049357/c4c27244-20e9-4d3e-af63-17d00c8c53d4



