import grammar, {TiddlyWikiBlocksSemantics, TiddlyWikiMarkdownSemantics} from './markdown.ohm-bundle';

const block_semantics: TiddlyWikiBlocksSemantics = grammar.TiddlyWikiBlocks.createSemantics();
const line_semantics: TiddlyWikiMarkdownSemantics = grammar.TiddlyWikiMarkdown.createSemantics();

block_semantics.addOperation<string>('markdown()', {
    _terminal() {
        return this.sourceString;
    },
    _iter(...children) { return children.map(c => c.markdown()).join(''); },
    document(a) { return a.children.map(c => c.markdown()).join(''); },
    block(a) { return a.children.map(c => c.markdown()).join(''); },
    code_block(a0, a1, a2, a3, a4) { return a0.markdown() + a1.markdown() + a2.markdown() + a3.markdown() + a4.markdown(); },
    inner_block(a) { return a.children.map(c => c.markdown()).join(''); },
    line_quote(a0, a1, a2) { return a0.markdown() + a1.markdown() + a2.markdown(); },
    block_quote(_0, _1, _2, a3, _4, _5) { 
        const quote_lines = a3.markdown().split('\n');
        return quote_lines.map((l: any) => `> ${l}`).join('\n') + '\n';
    },
    list(a) { return a.children.map(c => c.markdown()).join(''); },
    list_item(a) { return a.children.map(c => c.markdown()).join(''); },
    bullet_item(_a0, _a1, _a2, a3) { return `* ${a3.markdown()}`; },
    ordered_item(_a0, _a1, _a2, a3) { return `1. ${a3.markdown()}`; },
    heading(_a0, _a1, _a2, a3) { return `! ${a3.markdown()}\n`; },
    nl(_a0) { return '\n'; },
    sp(a0) { return ' '; },
    blank(a0, a1) { return a0.children.map(c => c.markdown()).join('') + a1.markdown(); },
    endline(a0, a1) { return a0.children.map(c => c.markdown()).join('') + a1.markdown(); },
    line(a0, a1) { return a0.children.map(c => c.markdown()).join('') + a1.markdown(); },
    rest(a0, a1) { return a0.children.map(c => c.markdown()).join('') + a1.markdown(); },
    continuation_line(a0, a1, a2) { 
        return a0.children.map(c => c.markdown()).join('') 
            + a1.children.map(c => c.markdown()).join('') 
            + a2.markdown();    
    },
    paragraph(a0) { 
        return convertTiddlyWikiLineToMarkdown(a0.markdown()); 
    },
    paragraph_last(a0) { 
        return convertTiddlyWikiLineToMarkdown(a0.markdown()); 
    },
    paragraph_para(a0, a1) { 
        const paragraph = a0.markdown() + a1.children.map(c => c.markdown()).join('') 
        return convertTiddlyWikiLineToMarkdown(paragraph); 
    },
  })

line_semantics.addOperation<string>('markdown()', {
    _terminal() {
        return this.sourceString;
    },
    _iter(...children) { return children.map(c => c.markdown()).join(''); },
    plain(a) {
      return a.children.map(c => c.markdown()).join('');
    },
    bold(a) { return "**"; },
    italic(a) { return "_"; },
    strike(a) { return "~~"; },
    code(_1, a, _2) {
      return `\`${a.children.map(c => c.markdown()).join('')}\``;
    },
});

export function convertTiddlyWikiLineToMarkdown(text: string): string {
    const matchResult = grammar.TiddlyWikiMarkdown.match(text);
    if (matchResult.failed()) {
        return `failed to parse: ${text}`;
    } else {
        return line_semantics(matchResult).markdown();
    }
}

export function convertTiddlyWikiToMarkdown(text: string): string {
    const matchResult = grammar.TiddlyWikiBlocks.match(text);
    if (matchResult.failed()) {
        console.log(grammar.TiddlyWikiBlocks.trace(text).toString())
        return `failed to parse: ${text}`;
    } else {
        return block_semantics(matchResult).markdown();
    }
}
