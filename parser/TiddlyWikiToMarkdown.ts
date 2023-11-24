import grammar, {TiddlyWikiBlocksSemantics, TiddlyWikiMarkdownSemantics} from './markdown.ohm-bundle';
const toAST = require('ohm-js/extras').toAST;

const block_semantics: TiddlyWikiBlocksSemantics = grammar.TiddlyWikiBlocks.createSemantics();
const line_semantics: TiddlyWikiMarkdownSemantics = grammar.TiddlyWikiMarkdown.createSemantics();

block_semantics.addOperation<string>('markdown()', {
    _terminal() { return this.sourceString; },
    _iter(...children) { return children.map(c => c.markdown()).join(''); },
    _nonterminal(...children) { return children.map(c => c.markdown()).join(''); },
    document(a) { return a.children.map(c => c.markdown()).join(''); },
    block(a) { return a.markdown(); },
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
    heading(a0, a1, a2) { 
        let hx = a0.children.map(c => '#').join('');
        let sp = a1.children.map(c => c.markdown()).join('');
        let heading = a2.markdown();
        return `${hx}${sp}${heading}`;
    },
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
    paragraph(a0) { return a0.markdown(); },
    paragraph_last(a0) { 
        return convertTiddlyWikiLineToMarkdown(a0.markdown()); 
    },
    paragraph_para(a0, a1) { 
        const paragraph = a0.markdown() + a1.children.map(c => c.markdown()).join('') 
        return convertTiddlyWikiLineToMarkdown(paragraph); 
    },
  })

line_semantics.addOperation<string>('markdown()', {
    _terminal() { return this.sourceString; },
    _iter(...children) { return children.map(c => c.markdown()).join(''); },
    _nonterminal(...children) { return children.map(c => c.markdown()).join(''); },
    paragraph(a) { return a.children.map(c => c.markdown()).join(''); },
    chunk(a) { return a.markdown(); },
    word(a) { return a.children.map(c => c.markdown()).join(''); },
    number(a) { return a.children.map(c => c.markdown()).join(''); },
    punct(a) { return a.sourceString; },
    markup(a) { return a.markdown(); },
    link(a) { return a.markdown(); },
    wikilink(_0, a1, _2, a3, _4) { 
        if ( a3.children.length > 0 ) {
            let displayText = a1.children.map(c => c.markdown()).join('');
            let linkText = a3.children.map(c => c.markdown()).join('');
            if ( linkText.includes('://') ) {
                return `[${displayText}](${linkText})`;
            }
            return `[[${linkText}|${displayText}]]`;
        } else {
            let linkText = a1.children.map(c => c.markdown()).join('');
            return `[[${linkText}]]`;
        }
    },
    extlink(_0, a1, _2, a3, _4) {
        let linkText = a1.children.map(c => c.markdown()).join('');
        let displayText = a3.children.map(c => c.markdown()).join('');
        return `[${displayText}](${linkText})`;
    },
    autolink(a0, a1, a2) {
        return `${a0.sourceString}${a1.sourceString}${a2.children.map(c => c.markdown()).join('')}`;
    },
    bold(a) { return "**"; },
    italic(a) { return "_"; },
    strike(a) { return "~~"; },
    imglink(_0, a1, _2) {
        let linkText = a1.children.map(c => c.markdown()).join('');
        if ( linkText.includes('://') ) {
            return `![${linkText}](${linkText})`;
        } 
        return `![[${linkText}]]`;
    },
    camel_case_link(a1, a2, a3, a4) { 
      let u1 = a1.sourceString;
      let l1 = a2.children.map(c => c.markdown()).join('');
      let u2 = a3.sourceString;
      let w2 = a4.children.map(c => c.markdown()).join('');
      return `[[${u1}${l1}${u2}${w2}]]`;
    },
    esc_camel_case_link(_0, a1) { return a1.sourceString; },
    code(_1, a, _2) {
      return `\`${a.children.map(c => c.markdown()).join('')}\``;
    },
});

block_semantics.addOperation<string>('ast()', {
    _terminal() { return this.sourceString; },
    _iter(...children) { return children.map(c => c.ast()).join(''); },
    _nonterminal(...children) { 
        if ( ['any', 'upper', 'lower', 'sp', 'sps', 'letter', 'punct', 'chunk'].includes(this.ctorName) ) {
            return children.map(c => c.ast()).join('');
        }
        return `{${this.ctorName}: ${children.map(c => c.ast()).join('')}}`; 
    },
})

line_semantics.addOperation<string>('ast()', {
    _terminal() { return this.sourceString; },
    _iter(...children) { return children.map(c => c.ast()).join(''); },
    _nonterminal(...children) { 
        if ( ['any', 'upper', 'lower', 'sp', 'sps', 'letter', 'punct', 'chunk'].includes(this.ctorName) ) {
            return children.map(c => c.ast()).join('');
        }
        return `{${this.ctorName}: ${children.map(c => c.ast()).join('')}}`; 
    },
})

export function convertTiddlyWikiLineToMarkdown(text: string): string {
    const matchResult = grammar.TiddlyWikiMarkdown.match(text);
    if (matchResult.failed()) {
        return `failed to parse: ${matchResult.message}`;
    } else {
        const ast = line_semantics(matchResult).ast();
        console.log(`TM AST LINE: ${text} -->\n${ast}`)
        return line_semantics(matchResult).markdown();
    }
}

export function convertTiddlyWikiToMarkdown(text: string): string {
    const matchResult = grammar.TiddlyWikiBlocks.match(text);
    if (matchResult.failed()) {
        return `failed to parse: ${matchResult.message}`;
    } else {
        const ast = block_semantics(matchResult).ast();
        console.log(`TM AST BLOCK: ${text} -->\n${ast}`)
        return block_semantics(matchResult).markdown();
    }
}
