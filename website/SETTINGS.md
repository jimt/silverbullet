This page contains settings for configuring SilverBullet and its Plugs. Changing any of these will go into effect immediately in most cases except `indexPage` and `customStyles`, which require a reload.

```yaml
# Initial page to load when launching SB, can contain template variables
indexPage: "[[SilverBullet]]"

# Load custom CSS styles from the following page, can also be an array
customStyles: "[[STYLES]]"

# Hide the sync button
hideSyncButton: false

# Configure the shown action buttons (top right bar)
actionButtons: 
- icon: home # Use any icon from https://feathericons.com
  command: "{[Navigate: Home]}"
  description: "Go to the index page"
- icon: activity
  description: "What's new"
  command: '{[Navigate: To Page]("CHANGELOG")}'
- icon: book
  command: "{[Navigate: Page Picker]}"
  description: Open page
- icon: terminal
  command: "{[Open Command Palette]}"
  description: Run command

# Override keyboard shortcuts and command priority
shortcuts:
- command: "{[Stats: Show]}" # Using the command link syntax here
  mac: "Cmd-s" # Mac-specific keyboard shortcut
  key: "Ctrl-s" # Windows/Linux specific keyboard shortcut
- command: "Navigate: Center Cursor" # But a command name is also supported 
  key: "Alt-x"
- command: "{[Upload: File]}"
  priority: 1 # Make sure this appears at the top of the list in the command palette
- command: "{[Open Command Palette]}"
  key: "Ctrl-."

# Defines files to ignore in a format compatible with .gitignore
spaceIgnore: |
   dist
   largefolder
   *.mp4

```
