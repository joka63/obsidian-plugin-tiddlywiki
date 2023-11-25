import * as path from "path";
import * as fs from "fs";

import { convertTiddlersToObsidianMarkdown, markdownArrayDirectories } from '../services/TiddlyWikiToMarkdownService';
import { Tiddler } from "services/MarkdownToTiddlyWikiService";

export type TiddlyJsonFileTestData = { label: string, json_file: string, toc_name?: string, expectedDirs?: string[]  }

export const tiddlyJsonFileTestData: TiddlyJsonFileTestData[] = [
    { label: "without content mapping", json_file: "Aikido-Zen.json" },
    { label: "with content mapping", json_file: "Aikido-Zen.json", 
      toc_name: "Inhalt", 
      expectedDirs: ["Aiki-Taiso", "Ukemi"] 
    },
]

global.File = class MockFile {
    constructor(readonly fileBits: BlobPart[], readonly fileName: string, readonly options?: FilePropertyBag) {}
    readonly lastModified: number = 0;
    readonly name: string = this.fileName;
    readonly webkitRelativePath: string = "";
    readonly size: number = 0;  
    readonly type: string = ""; 
    readonly slice: Blob["slice"] = (start?: number, end?: number, contentType?: string) => new Blob(this.fileBits, this.options);  
    readonly arrayBuffer: Blob["arrayBuffer"] = () => Promise.resolve(new ArrayBuffer(0));  
    readonly text: Blob["text"] = () => Promise.resolve("");
    readonly stream: Blob["stream"] = () => new ReadableStream();
}

describe("convert", () => {
    it.each<TiddlyJsonFileTestData>(tiddlyJsonFileTestData)("Import tiddler hierarchy from $json_file: $label", 
                                                            async ({json_file, toc_name, expectedDirs}) => {
		const dirPath = path.join(__dirname, "samples");
        const filePath = path.join(dirPath, json_file);
		const jsonText = fs.readFileSync(filePath, "utf-8");
        const tiddlers: Tiddler[] = JSON.parse(jsonText);
        expect(tiddlers.length).toBeGreaterThan(0);
        if (toc_name) expect(tiddlers).toContainEqual(expect.objectContaining({ title: toc_name }));
        const markdownArray = convertTiddlersToObsidianMarkdown(tiddlers, toc_name);
        if (!toc_name) {
            for (const markdownFile of markdownArray) {
                expect(markdownFile.filename).toEqual(`${markdownFile.title}.md`.replace(/[\/\:\\]/g, ''));
            }
        }
        if (toc_name) {
            expect(markdownArrayDirectories(markdownArray)).toEqual(expectedDirs);
        }
        // console.log(JSON.stringify(tiddlers, null, 2));
    })
});