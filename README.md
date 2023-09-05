# timelogconverter

This repository converts [TogglTrack](https://toggl.com/track/) entries to a new format.

# Using this converter
You can setup toggl integration or convert a csv file exported from toggl.
In both ways the result is displayed in the terminal. Copy and paste it in the final spreadsheet.

## With Toggl API integration
Add a .env file with those properties
```
TOGGL_API_KEY=<your_api_key>
TOGGL_WORKSPACE_ID=<your_workspace_id>
TOGGL_USER_ID=<your_user_id>
```

Run
```
  yarn toggl
```

## With CSV exported file
```
  yarn csv <your_toggl_exported_file.csv>
```

# How to track hours
## Install [toggl extension](https://chrome.google.com/webstore/detail/toggl-track-productivity/oejgccbfbmkkpaidnkphaiaecficdnfn)

This extension adds a "Start/Stop" button in Shortcut's stories. You can the button to start new time entries:
- Start a new time entry using "Start time" button in Shortcut.
- Add the related tags (bug, feature, or chore)

You don't need to add tags every time in toggl, but this is a good practice. 

https://github.com/cesarviana/timelogconverter/assets/6049357/b61c23c8-51e3-4451-ac30-15cd767d3fb7

# Exporting Toggl csv
If you didn't setup Toggl integration, you need to export detailed time entries.

Access Toggl and
- Go to Reports, and go to Detailed tab. 
- Select the current week, and filter by your own time entries. 
- Export the csv file.
- Having the csv file you can use this converter to transform the data to final timelog sheet format

https://github.com/cesarviana/timelogconverter/assets/6049357/0683517e-5389-4eaf-bfa8-01cc8d8fa1e2
