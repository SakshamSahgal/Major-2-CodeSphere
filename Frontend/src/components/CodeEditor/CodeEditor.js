import React, { useState } from 'react';
import { cpp } from "@codemirror/lang-cpp";
import CodeMirror from '@uiw/react-codemirror';
import { Dropdown } from 'react-bootstrap';

// Import the themes
import { abyss } from '@uiw/codemirror-theme-abyss';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

function CodeEditor({ height }) {
    const [selectedTheme, setSelectedTheme] = useState('default');

    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
    };

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
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <CodeMirror
                            height={height || "500px"}
                            theme={selectedTheme === 'default' ? undefined : selectedTheme}
                            extensions={[cpp()]}
                            onChange={(editor, data, value) => {
                                // Handle changes here if needed
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CodeEditor;
