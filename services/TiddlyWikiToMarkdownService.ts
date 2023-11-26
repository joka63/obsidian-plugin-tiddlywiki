import * as fs from "fs";
import * as path from "path";
import { Tiddler, ObsidianMarkdown } from "../model/NotesMetaData";
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
		const fileName = markdownFile.filename || `${markdownFile.title}.md`.replace(/[\/\:\\]/g, '');

		fs.writeFileSync(path.join(directoryPath, fileName), markdownFile.content, 'utf-8');
	}
}
