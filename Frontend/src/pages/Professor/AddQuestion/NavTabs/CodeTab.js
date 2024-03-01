import React from 'react';
import { Form, Nav, Tab } from 'react-bootstrap';
import CodeEditor from '../../../../components/CodeEditor/CodeEditor';
import SolutionCodeTab from './SolutionCodeTab';
import RandomTestCodeTab from './RandomTestCodeTab';

function CodeTab() {
    return (
        <Tab.Container defaultActiveKey={"SolutionCode"}>
            <Nav variant="tabs" className="my-3" fill>
                <Nav.Item>
                    <Nav.Link eventKey="SolutionCode">Solution Code</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="RandomTestCode">Random Test Case Code</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="SolutionCode">
                    <SolutionCodeTab />
                </Tab.Pane>
                <Tab.Pane eventKey="RandomTestCode">
                    <RandomTestCodeTab />
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    );
}

export default CodeTab;
