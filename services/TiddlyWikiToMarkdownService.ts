import * as fs from "fs";
import * as path from "path";
import { Tiddler, ObsidianMarkdown } from "../model/NotesMetaData";
import { dir } from "console";
export { convertTiddlyWikiToMarkdown } from "../parser/TiddlyWikiToMarkdown";

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

export async function writeObsidianMarkdownFiles(markdownArray: ObsidianMarkdown[], directoryPath: string) {
	fs.mkdirSync(directoryPath, { recursive: true });

	for (const markdownFile of markdownArray) {
		const filePath = markdownFile.filename || `${markdownFile.title}.md`.replace(/[\/\:\\]/g, '');
		const relDir = path.dirname(filePath);
		const baseName = path.basename(filePath);
		const fullPath = path.join(directoryPath, relDir, baseName)
		console.log("Writing file: " + fullPath);
		fs.mkdirSync(path.join(directoryPath, relDir), { recursive: true });
		fs.writeFileSync(fullPath, markdownFile.content, 'utf-8');
	}
}
