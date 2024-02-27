import React, { useEffect, useState } from 'react';
import { cpp } from "@codemirror/lang-cpp";
import CodeMirror from '@uiw/react-codemirror';
import { Dropdown } from 'react-bootstrap';

// Import the themes
import { abyss } from '@uiw/codemirror-theme-abyss';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { githubLight } from '@uiw/codemirror-theme-github'; // GitHub theme
import { githubDark } from '@uiw/codemirror-theme-github'; // GitHub theme

function CodeEditor({ height, defaultCode, onUpdateCode }) {
    const [selectedTheme, setSelectedTheme] = useState('default');

    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
    };

    const handleChange = (editor, data, value) => {
        onUpdateCode(editor); // Call the onUpdateCode function passed from the parent component
    };

    useEffect(() => {
        // Call onUpdateCode with defaultCode when component mounts
        onUpdateCode(defaultCode);
    }, []); // Empty dependency array ensures this effect runs only once, on mount

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
                            extensions={[cpp()]}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CodeEditor;
