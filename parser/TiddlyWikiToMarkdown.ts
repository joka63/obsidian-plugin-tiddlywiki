import grammar, {TiddlyWikiMarkdownSemantics} from './markdown.ohm-bundle';

const semantics: TiddlyWikiMarkdownSemantics = grammar.TiddlyWikiMarkdown.createSemantics();

semantics.addOperation<string>('markdown()', {
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

export function convertTiddlyWikiToMarkdown(text: string): string {
    const matchResult = grammar.TiddlyWikiMarkdown.match(text);
    if (matchResult.failed()) {
        return `failed to parse: ${text}`;
    } else {
        return semantics(matchResult).markdown();
    }
}
