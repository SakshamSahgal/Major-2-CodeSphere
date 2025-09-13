import React, { useState } from 'react';
import { cpp } from "@codemirror/lang-cpp";
import CodeMirror from '@uiw/react-codemirror';
import { Dropdown } from 'react-bootstrap';

// Import the themes
import { abyss } from '@uiw/codemirror-theme-abyss';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { githubLight } from '@uiw/codemirror-theme-github';
import { githubDark } from '@uiw/codemirror-theme-github';

import { EditorView } from "@codemirror/view";

function CodeEditor({ height = "500px", defaultCode, onUpdateCode, defaultTheme = githubDark, isEditable }) {
    const [selectedTheme, setSelectedTheme] = useState(defaultTheme);

    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
    };

    const handleChange = (value) => {
        onUpdateCode(value); // Pass the updated code text
    };

    // Extension to disable copy/paste
    // const disableCopyPaste = EditorView.domEventHandlers({
    //     copy: (event) => {
    //         event.preventDefault();
    //         return true;
    //     },
    //     cut: (event) => {
    //         event.preventDefault();
    //         return true;
    //     },
    //     paste: (event) => {
    //         event.preventDefault();
    //         return true;
    //     },
    //     contextmenu: (event) => {
    //         event.preventDefault(); // disable right-click menu too
    //         return true;
    //     }
    // });

    return (
        <>
            <div className="container">
                <div className="row my-3">
                    <div className="col text-end">
                        <Dropdown>
                            <Dropdown.Toggle variant="danger" id="dropdown-basic">
                                Select Theme
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleThemeChange('default')}>Default</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleThemeChange(abyss)}>Abyss</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleThemeChange(dracula)}>Dracula</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleThemeChange(okaidia)}>Okaidia</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleThemeChange(githubLight)}>githubLight</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleThemeChange(githubDark)}>githubDark</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <CodeMirror
                            value={defaultCode}
                            height={height || "500px"}
                            theme={selectedTheme === 'default' ? undefined : selectedTheme}
                            // extensions={[cpp(), disableCopyPaste]}
                            extensions={[cpp()]}
                            editable={isEditable}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CodeEditor;
