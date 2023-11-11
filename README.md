# Import/Export TiddlyWiki 

Import and export from TiddlyWiki with JSON files.


## How to use import from TiddlyWiki

### In TiddlyWiki:
- Tools -> Export all -> JSON File

### In Obsidian:
- Settings -> Community plugins -> Activate "TiddlyWiki JSON"
- Settings -> TiddlyWiki JSON
- Push the "Import .json" button to select a .json file that you have exorted from your TiddlyWiki.

## How to use export from TiddlyWiki

### In Obsidian:
- Settings -> Community plugins -> Activate "TiddlyWiki JSON"
- Settings -> TiddlyWiki JSON
- Push the "Export .json" button to select a .json file for export

### In TiddlyWiki:
- Tools -> Import


## How to install

### Option 1: Clone repo

- Clone this repo to your vault `VaultFolder/.obsidian/plugins/`
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

### Option 2: Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-plugin-tiddlywiki`.
