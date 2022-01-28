import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeMathjax from 'rehype-mathjax';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import CodeMirrorEditor from './CodeMirror';
import FileNavigator from './FileNavigator';
import useDir from './hooks/useDir';
import useWebsiteBuilder from './hooks/useWebsiteBuilder';
import { injectCSS, Theme, CSSConfig } from './themes/theme';
import defaultTheme from './themes/default';
import amandaTheme from './themes/amanda-burcroff';
import dexterTheme from './themes/dexter-chua';
import './App.css';
import './one-dark.css';
import FOLDER_ICON from './assets/icons/folder.png';

const NAVBAR_HEIGHT = '64px';

function App() {
  const [directory, lastOpenedFile, loadFile] = useDir();
  const [theme, setTheme] = useState<Theme>(dexterTheme);
  const [editorValue, setEditorValue] = useState(lastOpenedFile
    ? lastOpenedFile.content : theme.defaultText);
  const [showLeftMenu, setShowLeftMenu] = useState(false);

  const onCodeMirrorChange = useCallback(({ target }) => {
    const { value }: { value: string } = target;
    setEditorValue(value);
  }, [setEditorValue]);

  const onThemeChange = useCallback((evt) => {
    const { value } = evt.target;
    if (value === 'amanda') {
      setTheme(amandaTheme);
    } else if (value === 'dexter') {
      setTheme(dexterTheme);
    } else if (value === 'default') {
      setTheme(defaultTheme);
    }
  }, [setTheme]);

  const [build] = useWebsiteBuilder();

  const buildWebsite = useCallback(() => {
    build(editorValue, (html) => {
      const zip = new JSZip();
      zip.file('index.html', theme.generateHTML(html));
      zip.file('stylesheet.css', theme.generateCSS());
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        FileSaver.saveAs(blob, 'homepage.zip');
      });
    });
  }, [theme, editorValue]);

  return (
    <Row className="App gx-0">
      {showLeftMenu && (
        <Col xs={12} sm={3} style={{ height: '100vh' }}>
          <FileNavigator
            files={directory ? directory.files : []}
            selectedFile={lastOpenedFile?.id}
          />
        </Col>
      )}
      <Col sm={showLeftMenu ? 9 : 12}>
        <Navbar bg="dark" variant="dark" className="px-1" style={{ height: NAVBAR_HEIGHT }}>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setShowLeftMenu(!showLeftMenu)}><img className="icon-folder" alt="folder icon" width="24px" src={FOLDER_ICON} /></Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <Form className="mx-3">
            <Form.Group style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Label style={{ color: 'white', paddingRight: '0.8em', margin: 0 }}>Theme: </Form.Label>
              <Form.Select value={theme.name} onChange={onThemeChange} style={{ maxWidth: '200px' }} size="sm">
                <option value="amanda">Amanda</option>
                <option value="dexter">Dexter</option>
                <option value="default">Default</option>
              </Form.Select>
            </Form.Group>
          </Form>

          <Button variant="primary" onClick={buildWebsite} size="sm">
            Build website
          </Button>
        </Navbar>
        <Container fluid>
          <Row className="gx-0 overflow-scroll">
            <Col sm className="overflow-scroll" style={{ height: `calc(100vh - ${NAVBAR_HEIGHT})` }}>
              <form style={{ height: '100%' }}>
                <CodeMirrorEditor
                  value={editorValue}
                  onChange={onCodeMirrorChange}
                  config={{
                    mode: 'markdown',
                    theme: 'one-dark',
                    lineWrapping: true,
                    lineNumbers: true,
                  }}
                />
              </form>
            </Col>
            <Result sm className="overflow-scroll" $cssConfig={theme.css()}>
              <ReactMarkdownWrapper>
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeMathjax, rehypeSlug]}
                >
                  {editorValue}
                </ReactMarkdown>
              </ReactMarkdownWrapper>
            </Result>
          </Row>
        </Container>
      </Col>
    </Row>
  );
}

const Result = styled(Col)<{ $cssConfig: CSSConfig[] }>`
  height: calc(100vh - 64px);
  img {
    width: 100%;
  }
  ${(props) => injectCSS(props.$cssConfig)}
`;

const ReactMarkdownWrapper = styled.div`
  padding: calc(1em + 1ex);
`;

export default App;
