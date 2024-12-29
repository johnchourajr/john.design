const red = '#ffffff';
const comment = '#ff000095';
const element = '#ff4343';
const green = '#aa9eff';
const yellow = '#bc56c1';
const purple = '#800080';
const pink = '#ffc0cb';
const cyan = '#00ffff';

export default {
  'code[class*="language-"]': {
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    borderRadius: '.5em',
    border: '',
    boxShadow: '',
    margin: '0',
    overflow: 'auto',
    padding: '1em',
  },
  ':not(pre) > code[class*="language-"]': {
    background: 'black',
    borderRadius: '.3em',
    border: '',
    boxShadow: '',
    padding: '.15em .2em .05em',
    whiteSpace: 'normal',
  },
  'pre[class*="language-"]::-moz-selection': {
    background: red,
    textShadow: 'none',
  },
  'pre[class*="language-"]::selection': {
    background: red,
    textShadow: 'none',
  },
  'pre[class*="language-"] ::-moz-selection': {
    textShadow: 'none',
    background: red,
  },
  'code[class*="language-"]::-moz-selection': {
    textShadow: 'none',
    background: red,
  },
  'code[class*="language-"] ::-moz-selection': {
    textShadow: 'none',
    background: red,
  },
  'pre[class*="language-"] ::selection': {
    textShadow: 'none',
    background: red,
  },
  'code[class*="language-"]::selection': {
    textShadow: 'none',
    background: red,
  },
  'code[class*="language-"] ::selection': {
    textShadow: 'none',
    background: red,
  },
  comment: {
    color: comment,
  },
  prolog: {
    color: comment,
  },
  doctype: {
    color: comment,
  },
  cdata: {
    color: comment,
  },
  punctuation: {
    Opacity: '.7',
  },
  namespace: {
    Opacity: '.7',
  },
  tag: {
    color: element,
  },
  boolean: {
    color: element,
  },
  number: {
    color: element,
  },
  deleted: {
    color: element,
  },
  keyword: {
    color: green,
  },
  property: {
    color: green,
  },
  selector: {
    color: green,
  },
  constant: {
    color: green,
  },
  symbol: {
    color: green,
  },
  builtin: {
    color: green,
  },
  'attr-name': {
    color: yellow,
  },
  'attr-value': {
    color: yellow,
  },
  string: {
    color: yellow,
  },
  char: {
    color: yellow,
  },
  operator: {
    color: yellow,
  },
  entity: {
    color: yellow,
    cursor: 'help',
  },
  url: {
    color: yellow,
  },
  '.language-css .token.string': {
    color: yellow,
  },
  '.style .token.string': {
    color: yellow,
  },
  variable: {
    color: yellow,
  },
  inserted: {
    color: yellow,
  },
  atrule: {
    color: purple,
  },
  regex: {
    color: pink,
  },
  important: {
    color: pink,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  '.language-markup .token.tag': {
    color: cyan,
  },
  '.language-markup .token.attr-name': {
    color: cyan,
  },
  '.language-markup .token.punctuation': {
    color: cyan,
  },
  '': {
    position: 'relative',
    zIndex: '1',
  },
  '.line-highlight.line-highlight': {
    background:
      'linear-gradient(to right, hsla(0, 0%, 33%, .1) 70%, hsla(0, 0%, 33%, 0))',
    borderBottom: '1px dashed hsl(0, 0%, 33%)',
    borderTop: '1px dashed hsl(0, 0%, 33%)',
    marginTop: '0.75em',
    zIndex: '0',
  },
  '.line-highlight.line-highlight:before': {
    backgroundColor: 'hsl(215, 15%, 59%)',
    color: 'hsl(24, 20%, 95%)',
  },
  '.line-highlight.line-highlight[data-end]:after': {
    backgroundColor: 'hsl(215, 15%, 59%)',
    color: 'hsl(24, 20%, 95%)',
  },
} as { [key: string]: React.CSSProperties };
