import React from 'react';
import { cpp } from "@codemirror/lang-cpp";
import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { Form } from 'react-bootstrap';

function CodeTab() {
    return (
        <>
            <Form.Group controlId="SolutionCode" className="my-3">
                <Form.Label style={{ color: "white" }}>Solution Code</Form.Label>
                <CodeMirror
                    id='SolutionCode'
                    value=""
                    options={{
                        mode: cpp,
                        theme: {okaidia}, // Set the theme to the chosen theme
                        lineNumbers: true,
                        scrollbarStyle: null,
                        extensions: [cpp()], // Extension functions should be passed in an array
                    }}
                    onChange={(editor, data, value) => {
                        // Handle changes here if needed
                    }}
                />
            </Form.Group>

            <Form.Check type="checkbox" id="randomTestChecked" label="Random Test Checked" style={{ color: "white" }} />

            <Form.Group controlId="randomTestCode" className="my-3">
                <Form.Label style={{ color: "white" }}>Random Test Code</Form.Label>
                <CodeMirror
                    value=""
                    options={{
                        mode: cpp,
                        theme: {okaidia}, // Set the theme to the chosen theme
                        lineNumbers: true,
                        scrollbarStyle: null,
                        extensions: [cpp()], // Extension functions should be passed in an array
                    }}
                    onChange={(editor, data, value) => {
                        // Handle changes here if needed
                    }}
                />
            </Form.Group>
        </>
    );
}

export default CodeTab;
