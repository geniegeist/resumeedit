import { injectCSSFile, CSSConfig, Theme } from './theme';

function cssConfig(): CSSConfig[] {
  return [{
    declaration: `font-family: 'Lora', serif;
  line-height: 1.5;`,
  }, {
    selector: 'h1',
    declaration: `font-size: 2rem;
  font-weight: 500;
  line-height: 2;
  margin: 0;
  padding: 0;`,
  }, {
    selector: 'h2, h3, h4, h5, h6',
    declaration: `margin: 0;
  padding: 0;
  color: #a81010;
  font-weight: 500;
  line-height: 2;`,
  }, {
    selector: 'h2',
    declaration: 'font-size: 1.7rem;',
  }, {
    selector: 'h3',
    declaration: 'font-size: 1.5rem;',
  }, {
    selector: 'h4',
    declaration: 'font-size: 1.3rem;',
  }, {
    selector: 'h5',
    declaration: 'font-size: 1.2rem;',
  }, {
    selector: 'h6',
    declaration: 'font-size: 1.1rem;',
  }, {
    selector: 'p',
    declaration: 'font-size: 1rem;',
  }, {
    selector: 'code',
    declaration: `font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  color: #d63384;
  font-size: 0.875rem;
  word-wrap: break-word;`,
  }, {
    selector: 'table',
    declaration: `border-color: grey;
  border-spacing: 2px;
  max-width: 100%;
  width: 100%;
  border-collapse: collapse;
  margin: 2em 0;`,
  }, {
    selector: 'table th, table td',
    declaration: `padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;`,
  }];
}

export const defaultText = `# Marius Hoffmann
  
## About Me
  
I have been a PhD student in mathematics at [Berkeley](https://math.berkeley.edu/) since August 2021. My advisor is [Prof. Hopkins](https://math.berkeley.edu/) and my main research interest is [tropical geometry](https://en.wikipedia.org/wiki/Tropical_geometry). Previously, I did my undergraduate at [Emory University](https://www.math.emory.edu/home/) (2017-2021). 

You can email me at [marius.hoffman@fake.berkeley.edu](mailto:marius.hoffman@fake.berkeley.edu).

## Education

|   Major           | University        | Year          |
|-----------        | -------------     | ------------- |
| MSc Mathematics   | UC Berkeley       | since 2021    | 
| BSc Mathematics   | Emory University  | 2017-2021     |

## Research
  
* [Some Invertibility Results for Parabolic Categories](https://thatsmathematics.com/mathgen/paper.php?nameType%5B1%5D=custom&customName%5B1%5D=Marius+Hoffman&nameType%5B2%5D=generic&nameType%5B3%5D=custom&customName%5B3%5D=&nameType%5B4%5D=custom&customName%5B4%5D=&seed=1315851073&format=pdf), 2021. With P. Wilson.
* [Uniqueness Methods In Representation Theory](https://thatsmathematics.com/mathgen/paper.php?nameType%5B1%5D=custom&customName%5B1%5D=Marius+Hoffman&nameType%5B2%5D=generic&nameType%5B3%5D=custom&customName%5B3%5D=&nameType%5B4%5D=custom&customName%5B4%5D=&seed=1697466307&format=pdf), 2020. With C. T. Li.  
* [Integrability In Applied Representation Theory](https://thatsmathematics.com/mathgen/paper.php?nameType%5B1%5D=custom&customName%5B1%5D=Marius+Hoffman&nameType%5B2%5D=generic&nameType%5B3%5D=custom&customName%5B3%5D=&nameType%5B4%5D=custom&customName%5B4%5D=&seed=497305197&format=pdf), 2020. With G. White.  

## Essays
    
- [Spectral theorem of synthetic operators (pdf)](https://www.google.de)
- [Newton's maxtrix decomposition $SV_{\\lambda}$](https://www.google.de)
- [Lindel??f-Locatelli Theorem (pdf)](https://www.google.de)
`;

function generateHTML(content: string): string {
  const html = `<!DOCTYPE html>
<html>
<head>
  <!-- Change title here -->
  <title>My Resume</title>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="stylesheet.css">
  <link rel="preconnect" href="https://fonts.googleapis.com"> 
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Marcellus+SC&display=swap" rel="stylesheet">
</head>
<body>
<div class="wrapper">
${content}
</div>
</body>
</html>
  `;
  return html;
}

function generateCSS(): string {
  const css = `html {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  font-size: 1.1rem;
}
  
img {
  width: 100%;
}

${injectCSSFile(cssConfig(), '.wrapper', `margin-top: 1rem;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;`, `
@media (min-width: 576px) {
  .wrapper {
    width: 500px;
  }
}

@media (min-width: 768px) {
  .wrapper {
    width: 640px;
  }
}`)}`;

  return css;
}

const theme: Theme = {
  name: 'classic',
  defaultText,
  css: cssConfig,
  generateHTML,
  generateCSS,
};

export default theme;
