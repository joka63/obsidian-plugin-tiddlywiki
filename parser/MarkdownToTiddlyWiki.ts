const toAST = require('ohm-js/extras').toAST;
import grammar, {MarkdownBlocksSemantics, MarkdownSemantics} from './markdown.ohm-bundle';

const block_semantics: MarkdownBlocksSemantics = grammar.MarkdownBlocks.createSemantics();
const line_semantics: MarkdownSemantics = grammar.Markdown.createSemantics();

block_semantics.addOperation<string>('tiddler()', {
    _terminal() { return this.sourceString; },
    _iter(...children) { return children.map(c => c.tiddler()).join(''); },
    _nonterminal(...children) { return children.map(c => c.tiddler()).join(''); },
    document(a) { return a.children.map(c => c.tiddler()).join(''); },
    block(a) { return a.tiddler(); },
    code_block(a0, a1, a2, a3, a4) { return a0.tiddler() + a1.tiddler() + a2.tiddler() + a3.tiddler() + a4.tiddler(); },
    inner_block(a) { return a.children.map(c => c.tiddler()).join(''); },
    quote(a) { 
        return `<<<\n${a.children.map(c => c.tiddler()).join('')}<<<\n` 
    },
    line_quote(_0, _1, a2) { return a2.tiddler(); },
    list(a) { return a.children.map(c => c.tiddler()).join(''); },
    list_item(a) { return a.tiddler(); },
    bullet_item(a0, _1, a2, a3) { 
        let ix = a0.children.length / 2 + 1;
        let bullets = '*'.repeat(ix);
        let sp = a2.children.map(c => c.tiddler()).join('');
        return `${bullets}${sp}${a3.tiddler()}`; 
    },
    numbered_item(a0, _a1, _a2, a3, a4) { 
        let ix = a0.children.length / 3 + 1;
        let bullets = '#'.repeat(ix);
        let sp = a3.children.map(c => c.tiddler()).join('');
        return `${bullets}${sp}${a4.tiddler()}`; 
    },
    heading(a0, a1, a2) { 
        let hx = a0.children.map(c => '!').join('');
        let sp = a1.children.map(c => c.tiddler()).join('');
        let heading = a2.tiddler();
        return `${hx}${sp}${heading}`;
    },
    nl(_a0) { return '\n'; },
    sp(a0) { return ' '; },
    blank(a0, a1) { return a0.children.map(c => c.tiddler()).join('') + a1.tiddler(); },
    endline(a0, a1) { return a0.children.map(c => c.tiddler()).join('') + a1.tiddler(); },
    line(a0, a1) { return a0.children.map(c => c.tiddler()).join('') + a1.tiddler(); },
    rest(a0, a1) { return a0.children.map(c => c.tiddler()).join('') + a1.tiddler(); },
    continuation_line(a0, a1, a2) { 
        return a0.children.map(c => c.tiddler()).join('') 
            + a1.children.map(c => c.tiddler()).join('') 
            + a2.tiddler();    
    },
    paragraph(a0) { return a0.tiddler(); },
    paragraph_last(a0) { 
        return convertMarkdownLineToTiddlyWiki(a0.tiddler()); 
    },
    paragraph_para(a0, a1) { 
        const paragraph = a0.tiddler() + a1.children.map(c => c.tiddler()).join('') 
        return convertMarkdownLineToTiddlyWiki(paragraph); 
    },
  })


line_semantics.addOperation<string>('tiddler()', {
    _terminal() { return this.sourceString; },
    _iter(...children) { return children.map(c => c.tiddler()).join(''); },
    _nonterminal(...children) { return children.map(c => c.tiddler()).join(''); },
    paragraph(a) { return a.children.map(c => c.tiddler()).join(''); },
    chunk(a) { return a.tiddler(); },
    markup(a) { return a.tiddler(); },
    word(a) { 
        let word = a.children.map(c => c.tiddler()).join('');
        if ( word.match(/^([A-Z][a-z]+[A-Z][A-Za-z]*)$/g) ) {
            return `~${word}`;
        }
        return word
    },
    number(a) { return a.children.map(c => c.tiddler()).join(''); },
    punct(a) { return a.tiddler(); },
    bold(a) { return "''"; },
    italic(a) { return "//"; },
    strike(a) { return "~~"; },
    wikilink(_0, a1, _2, a3, _4) { 
        let linkText = a1.children.map(c => c.tiddler()).join('');
        if ( a3.children.length > 0 ) {
            let displayText = a3.children.map(c => c.tiddler()).join('');
            return `[[${displayText}|${linkText}]]`;
        } else if ( linkText.match(/^([A-Z][a-z]+[A-Z][A-Za-z]*)$/g) ) {
            return `${linkText}`;
        } else {
            return `[[${linkText}]]`;
        }
    },
    extlink(_0, a1, _2, a3, _4) { 
        let displayText = a1.children.map(c => c.tiddler()).join('');
        let linkText = a3.children.map(c => c.tiddler()).join('');
        return `[[${displayText}|${linkText}]]`;
    },
    emblink(_0, a1) { return a1.tiddler(); },
    emb_wikilink(_0, a1, _2, a3, _4) { 
        let linkText = a1.children.map(c => c.tiddler()).join('');
        if ( a3.children.length > 0 ) {
            let displayText = a3.children.map(c => c.tiddler()).join('');
            return `[img[${displayText}|${linkText}]]`;
        } else {
            return `[img[${linkText}]]`;
        }
    },
    emb_extlink(_0, a1, _2, a3, _4) { 
        let displayText = a1.children.map(c => c.tiddler()).join('');
        let linkText = a3.children.map(c => c.tiddler()).join('');
        if ( displayText === linkText || displayText === '') {
            return `[img[${linkText}]]`;
        } else {
            return `[img[${displayText}|${linkText}]]`;
        }
    },    
    autolink(a0, a1, a2) {
        return `${a0.sourceString}${a1.sourceString}${a2.children.map(c => c.tiddler()).join('')}`;
    },
    code(_1, a, _2) {
      return `\`${a.children.map(c => c.tiddler()).join('')}\``;
    },
    nl(_a0) { return '\n'; },
    sp(a0) { return ' '; },
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


export function convertMarkdownLineToTiddlyWiki(text: string): string {
    const matchResult = grammar.Markdown.match(text);
    if (matchResult.failed()) {
        return `failed to parse: ${matchResult.message}`;
    } else {
        const ast = line_semantics(matchResult).ast();
        // console.log(`MT AST LINE: ${text} -->\n${ast}`)
        return line_semantics(matchResult).tiddler();
    }
}

/**
 * Converts a markdown string to a TiddlyWiki string.
 * See the tests in tests/MarkdownToTiddlyWiki.test.ts for examples
 * @param text  content of a markdown file
 * @returns the content of the file converted to TiddlyWiki
 */
export function convertMarkdownToTiddlyWiki(text: string): string {
    const matchResult = grammar.MarkdownBlocks.match(text);
    if (matchResult.failed()) {
        return `failed to parse: ${matchResult.message}`;
    } else {
        const ast = block_semantics(matchResult).ast();
        // console.log(`MT AST BLOCK: ${text} -->\n${ast}`)
        return block_semantics(matchResult).tiddler();
    }
}
