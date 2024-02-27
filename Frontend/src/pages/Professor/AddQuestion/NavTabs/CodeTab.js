import React from 'react';
import { Form, Nav, Tab } from 'react-bootstrap';
import CodeEditor from '../../../../components/CodeEditor/CodeEditor';
import TestSolutionCodeModal from '../TestSolutionCodeModal/TestSolutionCodeModal';

function CodeTab() {
    return (
        <Tab.Container defaultActiveKey={"SolutionCode"}>
            <Nav variant="tabs" className="my-3" fill>
                <Nav.Item>
                    <Nav.Link eventKey="SolutionCode">Solution Code</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="RandomTestCode">Random Test Code</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="SolutionCode">
                    <Form.Group controlId="SolutionCode" className="my-3">
                        <CodeEditor height={"500px"} defaultCode={"abc"} onUpdateCode={(value) => { console.log(value) }} />
                        <hr style={{ color: "white" }} />
                        <TestSolutionCodeModal />
                        <hr style={{ color: "white" }} />
                    </Form.Group>
                </Tab.Pane>
                <Tab.Pane eventKey="RandomTestCode">
                    <Form.Group controlId="randomTestCode" className="my-3">
                        <CodeEditor height={"500px"} defaultCode={"abc"} onUpdateCode={(value) => { console.log(value) }} />
                    </Form.Group>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    );
}

export default CodeTab;
