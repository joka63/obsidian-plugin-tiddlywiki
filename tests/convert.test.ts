import * as path from "path";
import * as fs from "fs";
import { convertTiddlyWikiToMarkdown } from "../services/TiddlyWikiToMarkdownService";
import { convertMarkdownToTiddlyWiki } from "../services/MarkdownToTiddlyWikiService";

export type TiddlyToMarkdownTestFiles = { tid_file: string, md_file: string, converted_tid_file: string };

export const markdownTestData: TiddlyToMarkdownTestFiles[] = [
	{ tid_file: "test.tid", md_file: "test.md", converted_tid_file: "from_markdown.tid" },
]

describe("convert", () => {
	it.each<TiddlyToMarkdownTestFiles>(markdownTestData)("TiddlyWiki to Markdown file: $tid_file", ({tid_file, md_file}) => {
		const basePath = path.join(__dirname, "samples");
		const tiddlerText = fs.readFileSync(path.join(basePath, tid_file), "utf-8");
		const expectedMarkdown = fs.readFileSync(path.join(basePath, md_file), "utf-8");

		const convertedMarkdown = convertTiddlyWikiToMarkdown(tiddlerText)

		expect(convertedMarkdown).toEqual(expectedMarkdown);
	});

    it.each<TiddlyToMarkdownTestFiles>(markdownTestData)("Markdown to TiddlyWiki file: $md_file", ({md_file, converted_tid_file}) => {
		const basePath = path.join(__dirname, "samples");
		const expectedTiddlerText = fs.readFileSync(path.join(basePath, converted_tid_file), "utf-8");
		const markdown = fs.readFileSync(path.join(basePath, md_file), "utf-8");

		const convertedTiddler = convertMarkdownToTiddlyWiki(markdown)

		// console.log({ expectedTiddlerText, convertedTiddler, markdown })

		expect(convertedTiddler).toEqual(expectedTiddlerText);
	});
});
