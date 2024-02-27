import React from 'react';
import { Form } from 'react-bootstrap';
import CodeEditor from "../../../../components/CodeEditor/CodeEditor"

function CodeTab() {
    return (
        <>
            <Form.Group controlId="SolutionCode" className="my-3">
                <Form.Label style={{ color: "white" }}>Solution Code</Form.Label>
                <CodeEditor height="500px" />
            </Form.Group>

            <Form.Check type="checkbox" id="randomTestChecked" label="Random Test Checked" style={{ color: "white" }} />
            <Form.Group controlId="randomTestCode" className="my-3">
                <Form.Label style={{ color: "white" }}>Random Test Code</Form.Label>
                <CodeEditor height="500px" />
            </Form.Group>
        </>
    );
}

export default CodeTab;
