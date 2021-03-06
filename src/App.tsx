import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
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
import useTheme from './hooks/useTheme';
import useActiveFile from './hooks/useActiveFile';
import { CSSConfig, injectCSS } from './themes/theme';
import SettingsModal from './SettingsModal';
import './App.css';
import './one-dark.css';
import FOLDER_ICON from './assets/icons/folder.svg';
import SAVE_ICON from './assets/icons/save-file.svg';
import SETTINGS_ICON from './assets/icons/settings.svg';

const NAVBAR_HEIGHT = '50px';

function App() {
  const {
    directory, saveFile, createFile, deleteFile, renameFile, createFolder, setLastOpenedFile, reset,
  } = useDir();
  const [activeFileId, setActiveFileId, getActiveFile] = useActiveFile(directory.lastOpenedFile?.id);
  const [theme, setTheme] = useTheme(getActiveFile()?.theme);
  const [editorValue, setEditorValue] = useState(getActiveFile()?.content ?? '# Edit me');
  const justOpenedFile = useRef(false);
  // observe when active file changes
  // load content and set theme of the
  // new active file
  useEffect(() => {
    const activeFile = getActiveFile();
    if (activeFile) {
      setEditorValue(activeFile.content);
      setTheme(activeFile.theme);
    }
  }, [getActiveFile, setTheme, setEditorValue]);

  const [fileChanged, setFileChanged] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [build] = useWebsiteBuilder();

  // Callbacks

  const onCodeMirrorChange = ({ target }: any) => {
    const { value }: { value: string } = target;
    setEditorValue(value);
    if (justOpenedFile.current) {
      // this case happens when user opens another file
      // the editor will report this change
      // but we will ignore this
      justOpenedFile.current = false;
    } else {
      setFileChanged(true);
    }
  };

  const onThemeChange = (evt: any) => {
    const newTheme = evt.target.value;
    setTheme(newTheme);
    if (activeFileId) {
      saveFile(activeFileId, editorValue, newTheme);
    }
  };

  const buildWebsite = () => {
    const activeFile = getActiveFile();
    if (!activeFile) {
      return;
    }
    saveFile(activeFile.id, editorValue, theme.name);
    build(editorValue, (html) => {
      const zip = new JSZip();
      zip.file('index.html', theme.generateHTML(html));
      zip.file('stylesheet.css', theme.generateCSS());
      zip.file('sourcecode.md', editorValue);
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        FileSaver.saveAs(blob, 'homepage.zip');
      });
    });
  };

  const saveFileCallback = (evt: any) => {
    if (activeFileId) {
      saveFile(activeFileId, editorValue, theme.name);
      setFileChanged(false);
    }
  };

  const onFileClick = (fileId: string) => {
    if (activeFileId) {
      saveFile(activeFileId, editorValue, theme.name);
      setFileChanged(false);
    }
    justOpenedFile.current = true;
    setLastOpenedFile(fileId);
    setActiveFileId(fileId);
  };

  const onDeleteFile = () => {
    if (activeFileId) {
      deleteFile(activeFileId);
    }
  };

  const onRenameFile = (newName: string) => {
    if (activeFileId) {
      renameFile(activeFileId, newName);
    }
  };

  const onResetFiles = () => {
    reset();
    setShowSettings(false);
    window.location.reload();
  };

  return (
    <Row className="App gx-0">
      {showLeftMenu && (
        <Col xs={12} sm={4} md={3} style={{ height: '100vh' }}>
          <FileNavigator
            files={directory.files}
            selectedFile={getActiveFile()?.id}
            onFileClick={onFileClick}
            onCreateFile={(name) => createFile(name)}
            onCreateFolder={(name) => createFolder(name)}
            onDeleteFile={onDeleteFile}
            onRenameFile={onRenameFile}
            onClose={() => setShowLeftMenu(false)}
          />
        </Col>
      )}
      <Col sm={showLeftMenu ? 8 : 12} md={showLeftMenu ? 9 : 12}>
        <Navbar
          bg="dark"
          variant="dark"
          style={{
            height: NAVBAR_HEIGHT, position: 'fixed', top: 0, width: '100%',
          }}
        >
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setShowLeftMenu(!showLeftMenu)} style={{ outline: 0 }}>
                <img className="icon-folder" alt="folder icon" width="24px" src={FOLDER_ICON} />
              </Nav.Link>
              <Nav.Link onClick={saveFileCallback} style={{ outline: 0 }}>
                <img className="icon-save" alt="folder icon" width="22px" src={SAVE_ICON} />
                {fileChanged && <span className="px-2">Unsaved changes</span>}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <Nav.Link onClick={() => setShowSettings(true)} style={{ outline: 0 }}>
            <img className="icon-save" alt="folder icon" width="22px" src={SETTINGS_ICON} />
          </Nav.Link>

          <Form>
            <Form.Group>
              <Form.Select value={theme.name} onChange={onThemeChange} size="sm">
                <option value="classic">Classic Theme</option>
                <option value="default">Default Theme</option>
                <option value="modern">Modern Theme</option>
              </Form.Select>
            </Form.Group>
          </Form>

          <Button variant="primary" onClick={buildWebsite} size="sm" className="mx-2">
            Build website
          </Button>
        </Navbar>
        <Container fluid style={{ position: 'fixed', top: '50px' }}>
          <Row className="gx-0">
            <Col
              xs={6}
              style={{ minHeight: 'calc(100vh - 50px)', height: 'calc(100vh - 50px)' }}
              className="overflow-scroll"
            >
              <form>
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
                <div style={{ height: '100px', backgroundColor: '#282C34' }} />
              </form>
            </Col>
            <Result xs={6} className="d-flex justify-content-center" $cssConfig={theme.css()} style={{ overflowY: 'scroll' }}>
              <ReactMarkdownWrapper>
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeMathjax, rehypeSlug]}
                >
                  {editorValue}
                </ReactMarkdown>
                <div style={{ height: '64px' }} />
              </ReactMarkdownWrapper>
            </Result>
          </Row>
        </Container>
      </Col>
      <SettingsModal
        show={showSettings}
        onHide={() => setShowSettings(false)}
        onReset={onResetFiles}
      />
    </Row>
  );
}

const Result = styled(Col) <{ $cssConfig: CSSConfig[] }>`
  height: calc(100vh - 50px);
  img {
    width: 100%;
  }
  ${(props) => injectCSS(props.$cssConfig)}
`;

const ReactMarkdownWrapper = styled.div`
  width: 100%;
  max-width: 640px;
  padding: 1em;
`;

export default App;
