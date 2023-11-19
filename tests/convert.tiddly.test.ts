import { convertTiddlyWikiToMarkdown } from "../parser/TiddlyWikiToMarkdown"
import { convertMarkdownToTiddlyWiki } from "../parser/MarkdownToTiddlyWiki"
import { TiddlyToMarkdownTestData } from "./TiddlyWikiToMarkdown.test";

export const markdownTestData: TiddlyToMarkdownTestData[] = [
    {   label: "simple text",
        tiddlerText: "The ''quick'' brown ~~flea~~ fox //jumps// over the `lazy` dog",
        expectedMarkdown: "The **quick** brown ~~flea~~ fox _jumps_ over the `lazy` dog"
    },
];

describe("convert", () => {
    it.each<TiddlyToMarkdownTestData>(markdownTestData)("TiddlyWiki to Markdown: $label", ({tiddlerText, expectedMarkdown}) => {
        const convertedMarkdown = convertTiddlyWikiToMarkdown(tiddlerText);
        // console.log(`${tiddlerText}:\n---\n${JSON.stringify(convertedMarkdown, null, 2)}`);
        expect(typeof convertedMarkdown).toEqual('string');
        expect(convertedMarkdown).toEqual(expectedMarkdown);
    })

    it.each<TiddlyToMarkdownTestData>(markdownTestData)("Markdown to TiddlyWiki: $label", ({tiddlerText, expectedMarkdown}) => {
        const convertedMarkdown = convertMarkdownToTiddlyWiki(expectedMarkdown);
        console.log(`${expectedMarkdown}:\n---\n${JSON.stringify(convertedMarkdown, null, 2)}`);
        expect(typeof convertedMarkdown).toEqual('string');
        expect(convertedMarkdown).toEqual(tiddlerText);
    })
});