import React from 'react';
import { Nav, Tab } from 'react-bootstrap';
import SolutionCodeTab from './SolutionCodeTab';
import RandomTestCodeTab from './RandomTestCodeTab';

function CodeTab({ formData, handleInputChange }) {


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
                    <SolutionCodeTab formData={formData} handleInputChange={handleInputChange} />
                </Tab.Pane>
                <Tab.Pane eventKey="RandomTestCode">
                    <RandomTestCodeTab formData={formData} handleInputChange={handleInputChange} />
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    );
}

export default CodeTab;
