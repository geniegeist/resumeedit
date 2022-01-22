import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import CodeMirrorEditor from './CodeMirror';
import './App.css';

const defaultValue = `# Viet Duc Nguyen

## About Me

I have been a PhD student at [Harvard](www.google.de) since September 2018. Previously, I did my undergraduate and Part III at [Cambridge](www.cambridge.co.uk) (2014–2018).

## Contact Me

You can email me at [dexter@math.harvard.edu](mailto:dexter@math.harvard.edu). My office is at 531.

## Adams Spectral Sequence for $tmf$

I have documented the calculation of the Adams spectral sequence of $tmf$ at the prime $2$ here (warning: this downloads a 12MB file behind the scenes).

This calculation was made with computer assistance. There is an online version of the software, and the source can be found on GitHub. See the README on GitHub for technical details.

The software computes the $E_2$ page and products, and propagates differentials via the Leibniz rule. The program is capable of resolving an arbitrary (finite dimensional or finitely generated) Steenrod module and assisting the computation of the associated Adams spectral sequence. It is also designed with the intention to be able to aid other spectral sequence calculations (as long as the modules are over $\\mathbb F_p$), but no such applications have been coded at the moment. It was initially developed by Hood Chatham and I later joined the development.

The save file for the calculation can be found here, which can be imported into the resolver to reproduce the calculation. (However, doing it on the online version above is unwise).

## Expository Writings

Some miscellaneous expository writings. The word "expository" refers to the lack of originality, as opposed to any claim of comprehensibility or correctness.

Clicking the title below will lead to a web version of the note, which is an experimental feature — let me know if anything seems broken. Click "pdf" for a downloadable pdf version.

- [Construction of synthetic spectra (pdf)](www.google.de)
- [Adams spectral sequence of $tmf \\land \\mathbb R\\mathbb P^{\\infty}$](www.google.de)
- [Borwein–Borwein integrals and sums (pdf)](www.google.de)


## Cambridge Course Notes

When I was in Cambridge, I typed up my lecture notes for the courses I attended. They can be found [here](www.google.de).

## Privacy Statement

I have a [Privacy Statement](www.google.de) as required by law (maybe).
`;

function App() {
  const [editorValue, setEditorValue] = useState(defaultValue);
  const onCodeMirrorChange = useCallback((value) => {
    setEditorValue(value);
  }, [setEditorValue]);

  return (
    <div className="App">
      <Editor>
        <form>
          <CodeMirrorEditor
            value={editorValue}
            onChange={onCodeMirrorChange}
          />
        </form>
      </Editor>

      <Result className="result">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeMathjax]}
        >
          {editorValue}
        </ReactMarkdown>
        <div style={{ height: '3em' }} />
      </Result>
    </div>
  );
}

const Editor = styled.div`
  position: fixed;
  left: 0;
  width: 50%;
  overflow: auto;
`;

const Result = styled.div`
  position: fixed;
  right: 0;
  left: 50%;
  overflow: auto;
  background-color: white;
  height: 100%;
  margin-bottom: 3em;
`;

export default App;
