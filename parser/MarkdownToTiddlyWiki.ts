import grammar, {MarkdownSemantics} from './markdown.ohm-bundle';

const semantics: MarkdownSemantics = grammar.Markdown.createSemantics();

semantics.addOperation<string>('tiddler()', {
    _terminal() {
        return this.sourceString;
    },
    _iter(...children) { return children.map(c => c.tiddler()).join(''); },
    plain(a) {
      const ret = a.children.map(c => c.tiddler()).join('');
      console.log(`###plain: ${ret}`)
      return ret
    },
    bold(a) { console.log('##bold##'); return "''"; },
    italic(a) { console.log('##italic##'); return "//"; },
    strike(a) { return "~~"; },
    code(_1, a, _2) {
      return `\`${a.children.map(c => c.tiddler()).join('')}\``;
    },
});

export function convertMarkdownToTiddlyWiki(text: string): string {
    const matchResult = grammar.Markdown.match(text);
    if (matchResult.failed()) {
        return `failed to parse: ${text}`;
    } else {
        return semantics(matchResult).tiddler();
    }
}
