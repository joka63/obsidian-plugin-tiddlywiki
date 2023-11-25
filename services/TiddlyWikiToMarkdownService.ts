import * as fs from "fs";
import * as path from "path";
import { convertTiddlyWikiToMarkdown } from "../parser/TiddlyWikiToMarkdown";
export { convertTiddlyWikiToMarkdown } from "../parser/TiddlyWikiToMarkdown";

export interface Tiddler {
	title: string;
	text: string;
	tags?: string;
	created: string;
	modified: string;
}

export type ObsidianMarkdown = {
	title: string;
	content: string;
	filename?: string;
	tags?: string[];
}

export async function convertJSONToTiddlers(file: File): Promise<Tiddler[]> {
	const fileReader = new FileReader();

	return new Promise((resolve, reject) => {
		fileReader.onload = () => {
			const tiddlers: Tiddler[] = JSON.parse(fileReader.result as string);
			resolve(tiddlers);
		};
		fileReader.onerror = () => {
			reject(fileReader.error);
		};
		fileReader.readAsText(file, 'UTF-8');
	});
}

/**
 * Converts tiddlers to Obsidian Markdown. If toc_name is provided, it will be used as the title of table of contents tiddler.
 * @param tiddlers 
 * @param toc_name 
 * @returns an array of ObsidianMarkdown objects, each containing the title, content, and filename of a tiddler
 */
export function convertTiddlersToObsidianMarkdown(tiddlers: Tiddler[], toc_name?: string) {
	const markdownArray: ObsidianMarkdown[] = [];

	for (const tiddler of tiddlers) {
		const frontMatter = `---\n`
			+ `${tiddler.tags ? `tags: ${tiddler.tags}\n` : ''}`
			+ `---\n`;

		const content = frontMatter + convertTiddlyWikiToMarkdown(tiddler.text);
		const filename = `${tiddler.title}.md`.replace(/[\/\:\\]/g, '');

		markdownArray.push({
			content,
			title: tiddler.title,
			filename,
			tags: tiddler.tags?.split(' ')
		});
	}
	analyseTiddlersHierarchy(markdownArray, toc_name);	
	return markdownArray;
}

function analyseTiddlersHierarchy(markdownArray: ObsidianMarkdown[], toc_name?: string) {
	if (!toc_name) return markdownArray;
	// console.log(`markdownArray: ${JSON.stringify(markdownArray, null, 2)}`);
	const titleSet = new Set<string>();
	const containers : { [key: string]: Set<string> } = {};
	const containees : { [key: string]: Set<string> } = {};
	for (const markdownFile of markdownArray) {
		if (markdownFile.title) {
			titleSet.add(markdownFile.title);
		}
	}
	// console.log(`tiddlers: ${JSON.stringify(titleSet, (_key, value) => (value instanceof Set ? [...value] : value), 2)}`);

	for (const markdownFile of markdownArray) {
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

	for (const markdownFile of markdownArray) {
		if (markdownFile.title === toc_name) continue;
		if (containees[markdownFile.title]) {
			let dir:string = Array.from(containees[markdownFile.title])[0];
			if (dir === toc_name) continue;
			markdownFile.filename = path.join(dir, markdownFile.filename || `${markdownFile.title}.md`.replace(/[\/\:\\]/g, ''));
		}
	}
	// console.log(`markdownArray: ${JSON.stringify(markdownArray, null, 2)}`);
}

/**
 * Gets a list of directories containing markdown files from the filenames in the markdownArray.
 * @param markdownArray 
 * @returns an alphabetically sorted list of directories containing markdown files
 * @throws an error if the directory does not exist
 */
export function markdownArrayDirectories(markdownArray: ObsidianMarkdown[]): string[] {
	let directorySet = new Set<string>();
	for (const markdownFile of markdownArray) {
		if (!markdownFile.filename) continue;
		const directory = path.dirname(markdownFile.filename).split('/')[0];
		if (directory && directory !== '.') directorySet.add(directory);
	}
	return Array.from(directorySet).sort();
}

export async function writeObsidianMarkdownFiles(markdownArray: ObsidianMarkdown[], directoryPath: string) {
	fs.mkdirSync(directoryPath, { recursive: true });

	for (const markdownFile of markdownArray) {
		const fileName = markdownFile.filename || `${markdownFile.title}.md`.replace(/[\/\:\\]/g, '');

		fs.writeFileSync(path.join(directoryPath, fileName), markdownFile.content, 'utf-8');
	}
}
