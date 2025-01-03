import { convertTiddlyWikiToMarkdown } from "../parser/TiddlyWikiToMarkdown"
import { convertMarkdownToTiddlyWiki } from "../parser/MarkdownToTiddlyWiki"

export type TiddlyToMarkdownTestData = { label: string, tiddlerText: string, expectedMarkdown: string };

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
    },
    {   label: "Beware of CamelCase links in URLs",
        tiddlerText: `[[Tips|https://wiki.centos.org/TipsAndTricks/SelinuxBooleans]]\nhttps://wiki.centos.org/TipsAndTricks/SelinuxBooleans`,
        expectedMarkdown: `[Tips](https://wiki.centos.org/TipsAndTricks/SelinuxBooleans)\nhttps://wiki.centos.org/TipsAndTricks/SelinuxBooleans`,
    },
    {   label: "Suppressed CamelCase links",
        tiddlerText: "Not a link: ~HelloThere is not a link",
        expectedMarkdown: "Not a link: HelloThere is not a link"
    },
    {   label: "Display text in links",
        tiddlerText: "Title different from page: [[Displayed Link Title|Tiddler Title]]",
        expectedMarkdown: "Title different from page: [[Tiddler Title|Displayed Link Title]]"
    },
    {   label: "Images",
        tiddlerText: "Two images: [img[Logo.png]] and external [img[https://tiddlywiki.com/favicon.ico]]",
        expectedMarkdown: "Two images: ![[Logo.png]] and external ![https://tiddlywiki.com/favicon.ico](https://tiddlywiki.com/favicon.ico)"
    },
    {   label: "Code blocks",
        tiddlerText: "```\nThis is a code block\n* Don't convert this to a list\n# A Comment\n! Not a header\n```",
        expectedMarkdown: "```\nThis is a code block\n* Don't convert this to a list\n# A Comment\n! Not a header\n```",
    },
    {   label: "Headings",
        tiddlerText: `! This is a level 1 heading\n!! This is a level 2 heading`,
        expectedMarkdown: `# This is a level 1 heading\n## This is a level 2 heading`
    },
    {   label: "Lists",
        tiddlerText: `* First list item\n* Second list item\n** A subitem\n* Third list item`,
        expectedMarkdown: `- First list item\n- Second list item\n  - A subitem\n- Third list item`
    },
    {   label: "Indented lists",
        tiddlerText: `* Test CTA\n** Lead magnet\n*** Thank you page`,
        expectedMarkdown: `- Test CTA\n  - Lead magnet\n    - Thank you page`
    },
    {   label: "Numbered lists",
        tiddlerText: `A numbered list:\n# First list item\n# Second list item\n## A subitem\n# Third list item`,
        expectedMarkdown: `A numbered list:\n1. First list item\n1. Second list item\n   1. A subitem\n1. Third list item`
    },
    {   label: "Quote in one line",
        tiddlerText: `<<<\nUn grand pouvoir implique de grandes responsabilités\n<<<\n`,
        expectedMarkdown: `> Un grand pouvoir implique de grandes responsabilités\n`
    },
    {   label: "Quote in two lines",
        tiddlerText: `<<<\nUn grand pouvoir implique de ''grandes'' responsabilités\nUn grand pouvoir implique de //grandes// responsabilités 2\n<<<\n`,
        expectedMarkdown: `> Un grand pouvoir implique de **grandes** responsabilités\n> Un grand pouvoir implique de _grandes_ responsabilités 2\n`
    },

];

describe("convert", () => {
    it.each<TiddlyToMarkdownTestData>(markdownTestData)("TiddlyWiki to Markdown: $label", ({tiddlerText, expectedMarkdown}) => {
        const convertedMarkdown = convertTiddlyWikiToMarkdown(tiddlerText);
        // console.log(`TM ${tiddlerText}:\n---\n${JSON.stringify(convertedMarkdown, null, 2)}`);
        expect(typeof convertedMarkdown).toEqual('string');
        expect(convertedMarkdown).toEqual(expectedMarkdown);
    })

    it.each<TiddlyToMarkdownTestData>(markdownTestData)("Markdown to TiddlyWiki: $label", ({tiddlerText, expectedMarkdown}) => {
        const convertedMarkdown = convertMarkdownToTiddlyWiki(expectedMarkdown);
        // console.log(`MT ${expectedMarkdown}:\n---\n${JSON.stringify(convertedMarkdown, null, 2)}`);
        expect(typeof convertedMarkdown).toEqual('string');
        expect(convertedMarkdown).toEqual(tiddlerText);
    })
});
