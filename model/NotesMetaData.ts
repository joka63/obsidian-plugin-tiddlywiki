import * as path from "path";
import { convertTiddlyWikiToMarkdown } from "../parser/TiddlyWikiToMarkdown";

export interface Tiddler {
	title: string;
	text: string;
	tags?: string;
	created: string;
	modified: string;
};

export type ObsidianMarkdown = {
	title: string;
	content: string;
	filename?: string;
	tags?: string[];
};


export class NotesMetaData {
	private _notes: ObsidianMarkdown[] = [];
	private _toc_name?: string;

    constructor(tiddlers: Tiddler[], toc_name?: string) {
		this._toc_name = toc_name;
		for (const tiddler of tiddlers) {
			const frontMatter = `---\n`
				+ `${tiddler.tags ? `tags: ${tiddler.tags}\n` : ''}`
				+ `---\n`;
	
			const content = frontMatter + convertTiddlyWikiToMarkdown(tiddler.text);
			const filename = `${tiddler.title}.md`.replace(/[\/\:\\]/g, '');
	
			this._notes.push({
				content,
				title: tiddler.title,
				filename,
				tags: tiddler.tags?.split(' ')
			});
		}
	}

	analyseTiddlersHierarchy(): ObsidianMarkdown[] {
		if (!this._toc_name) return this.notes;
		// console.log(`markdownArray: ${JSON.stringify(markdownArray, null, 2)}`);
		const titleSet = new Set<string>();
		const containers: { [key: string]: Set<string>; } = {};
		const containees: { [key: string]: Set<string>; } = {};
		for (const markdownFile of this._notes) {
			if (markdownFile.title) {
				titleSet.add(markdownFile.title);
			}
		}
		// console.log(`tiddlers: ${JSON.stringify(titleSet, (_key, value) => (value instanceof Set ? [...value] : value), 2)}`);
		for (const markdownFile of this._notes) {
			for (const tag of markdownFile.tags || []) {
				if (titleSet.has(tag)) {
					let title = markdownFile.title;
					if (!containees[title]) containees[title] = new Set<string>();
					containees[title].add(tag);
					if (!containers[tag]) containers[tag] = new Set<string>();
					containers[tag].add(markdownFile.title);
				}
			}
		}
		// console.log(`containers: ${JSON.stringify(containers, (_key, value) => (value instanceof Set ? [...value] : value), 2)}`);
		// console.log(`containees: ${JSON.stringify(containees, (_key, value) => (value instanceof Set ? [...value] : value), 2)}`);
		for (const markdownFile of this._notes) {
			if (markdownFile.title === this._toc_name) continue;
			if (containees[markdownFile.title]) {
				let dir: string = Array.from(containees[markdownFile.title])[0];
				if (dir === this._toc_name) continue;
				markdownFile.filename = path.join(dir, markdownFile.filename || `${markdownFile.title}.md`.replace(/[\/\:\\]/g, ''));
			}
		}
		// console.log(`markdownArray: ${JSON.stringify(markdownArray, null, 2)}`);
		return this.notes;
	}

	get notes(): ObsidianMarkdown[] {
        return this._notes;
    }

	/**
	 * Gets a list of directories containing markdown files from the filenames in the markdownArray.
	 * @param markdownArray
	 * @returns an alphabetically sorted list of directories containing markdown files
	 * @throws an error if the directory does not exist
	 */
	get directories(): string[] {
		let directorySet = new Set<string>();
		for (const markdownFile of this._notes) {
			if (!markdownFile.filename) continue;
			const directory = path.dirname(markdownFile.filename).split('/')[0];
			if (directory && directory !== '.') directorySet.add(directory);
		}
		return Array.from(directorySet).sort();
	}
}

/**
 * Converts tiddlers to Obsidian Markdown. If toc_name is provided, it will be used as the title of table of contents tiddler.
 * @param tiddlers
 * @param toc_name
 * @returns an array of ObsidianMarkdown objects, each containing the title, content, and filename of a tiddler
 */
export function convertTiddlersToObsidianMarkdown(tiddlers: Tiddler[], toc_name?: string): ObsidianMarkdown[] {
	const notes = new NotesMetaData(tiddlers, toc_name);
	return notes.analyseTiddlersHierarchy();
}
