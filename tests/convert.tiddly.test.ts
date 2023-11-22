import { convertTiddlyWikiToMarkdown } from "../parser/TiddlyWikiToMarkdown"
import { convertMarkdownToTiddlyWiki } from "../parser/MarkdownToTiddlyWiki"
import { TiddlyToMarkdownTestData } from "./TiddlyWikiToMarkdown.test";

export const markdownTestData: TiddlyToMarkdownTestData[] = [
    /** 
    */
    {   label: "simple text",
        tiddlerText: "The ''quick'' brown ~~flea~~ fox //jumps// over the `lazy` dog",
        expectedMarkdown: "The **quick** brown ~~flea~~ fox _jumps_ over the `lazy` dog"
    },
    {   label: "internal links",
        tiddlerText: "This is a link to HelloThere, and one to [[History of TiddlyWiki]]",
        expectedMarkdown: "This is a link to [[HelloThere]], and one to [[History of TiddlyWiki]]"
    },
    {   label: "URLs are not converted to links",
        tiddlerText: `https://tiddlywiki.com/ and [[TW5|https://tiddlywiki.com/]] are links`,
        expectedMarkdown: `https://tiddlywiki.com/ and [TW5](https://tiddlywiki.com/) are links`
    },
    {   label: "Distinguish between internal links with display text and external links",
        tiddlerText: `[[How to build a funnel 20/80|Funnel]]\nSee [[Internal Links|https://help.obsidian.md/Linking+notes+and+files/Internal+links]]`,
        expectedMarkdown: `[[Funnel|How to build a funnel 20/80]]\nSee [Internal Links](https://help.obsidian.md/Linking+notes+and+files/Internal+links)`
    }

];

describe("convert", () => {
    it.each<TiddlyToMarkdownTestData>(markdownTestData)("TiddlyWiki to Markdown: $label", ({tiddlerText, expectedMarkdown}) => {
        const convertedMarkdown = convertTiddlyWikiToMarkdown(tiddlerText);
        console.log(`TM ${tiddlerText}:\n---\n${JSON.stringify(convertedMarkdown, null, 2)}`);
        expect(typeof convertedMarkdown).toEqual('string');
        expect(convertedMarkdown).toEqual(expectedMarkdown);
    })

    it.each<TiddlyToMarkdownTestData>(markdownTestData)("Markdown to TiddlyWiki: $label", ({tiddlerText, expectedMarkdown}) => {
        const convertedMarkdown = convertMarkdownToTiddlyWiki(expectedMarkdown);
        console.log(`MT ${expectedMarkdown}:\n---\n${JSON.stringify(convertedMarkdown, null, 2)}`);
        expect(typeof convertedMarkdown).toEqual('string');
        expect(convertedMarkdown).toEqual(tiddlerText);
    })
});
