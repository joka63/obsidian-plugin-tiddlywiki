import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import * as path from 'path';
import { convertJSONToTiddlers, writeObsidianMarkdownFiles } from 'services/TiddlyWikiToMarkdownService';
import { convertTiddlersToObsidianMarkdown } from "model/NotesMetaData";
import { exportAllMarkdownFilesToJSON } from 'services/MarkdownToTiddlyWikiService';
import { downloadJsonAsFile } from 'utils/downloadJsonAsFile';

export default class TiddlyWikiJsonPlugin extends Plugin {
	async onload() {
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TiddlyWikiSettingTab(this.app, this));
	}
}

class TiddlyWikiSettingTab extends PluginSettingTab {
	plugin: TiddlyWikiJsonPlugin;

	constructor(app: App, plugin: TiddlyWikiJsonPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Import' });

		const form = containerEl.createEl('form', { attr: { "encType": "multipart/form-data", "hidden": true } })

		const input = containerEl.createEl('input')

		input.type = "file"
		input.id = "file-upload"
		input.multiple = false
		input.accept = ".json"

		input.addEventListener("change", async (event) => {
			if (input.files && input.files.length > 0) {
				for (let fileIndex = 0; fileIndex < input.files.length; fileIndex++) {
					const file = input.files.item(fileIndex)

					if (!file) {
						throw new Error('File is not defined')
					}

					const currentDate = new Date().toISOString().replace(/:/g, '_')

					const directoryPath = `TiddlyWiki-Import-${currentDate}`

					//@ts-ignore
					const exportPath = path.join(this.app.vault.adapter.basePath, directoryPath)

					const tiddlers = await convertJSONToTiddlers(file);
					const obsidianMarkdownArray = convertTiddlersToObsidianMarkdown(tiddlers);
					writeObsidianMarkdownFiles(obsidianMarkdownArray, exportPath);

					new Notice(`✅ Successfuly imported TiddlyWiki to ${exportPath}`, 10000)
				}
			}
		})

		form.appendChild(input)

		new Setting(containerEl)
			.setName('Import JSON')
			.setDesc('To export from TiddlyWiki : Tools->Export all->JSON File')
			.addButton(button => button
				.setButtonText("Import .json").onClick(() => {
					input.click()
				}))

		containerEl.createEl('h2', { text: 'Export' });

		new Setting(containerEl)
			.setName('Export JSON')
			.setDesc('To import in TiddlyWiki : Tools->Import')
			.addButton(button => button
				.setButtonText("Export .json").onClick(async () => {
					//@ts-ignore
					const basePath = this.app.vault.adapter.basePath

					const jsonExport = await exportAllMarkdownFilesToJSON(basePath)

					downloadJsonAsFile(jsonExport, "test.json")
				}))

	}
}

