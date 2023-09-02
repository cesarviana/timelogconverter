# timelogconverter

This repository converts [TogglTrack](https://toggl.com/track/) entries to a new format.

# Using this converter
```
  yarn // install dependencies
  node index.js <your_toggl_exported_file.csv>
```

This command outputs a file called `output.csv`. You can copy the rows and paste in your timelog tab.

https://github.com/cesarviana/timelogconverter/assets/6049357/c4c27244-20e9-4d3e-af63-17d00c8c53d4

# How to track hours
## Install [toggl extension](https://chrome.google.com/webstore/detail/toggl-track-productivity/oejgccbfbmkkpaidnkphaiaecficdnfn)

This extension adds a "Start/Stop" button in Shortcut's stories. You can the button to start new time entries:
- Start a new time entry using "Start time" button in Shortcut.
- Add the related tags (bug, feature, or chore)

You don't need to add tags every time in toggl, but this is a good practice. 

https://github.com/cesarviana/timelogconverter/assets/6049357/b61c23c8-51e3-4451-ac30-15cd767d3fb7

## Export toggl "Detailed" time entries

Every week you should export your time entries and convert to the correct format. 

In toggl
- Go to Reports, and go to Detailed tab. 
- Select the current week, and filter by your own time entries. 
- Export the csv file.
- Having the csv file you can use this converter to transform the data to final timelog sheet format

https://github.com/cesarviana/timelogconverter/assets/6049357/0683517e-5389-4eaf-bfa8-01cc8d8fa1e2
