import { Nav, Tab } from 'react-bootstrap';

function StudentAssignmentNavtabs({ activeTab, handleTabChange }) {
    return (
        <>
            <Nav variant="tabs" defaultActiveKey={activeTab} onSelect={handleTabChange}>
                <Nav.Item>
                    <Nav.Link eventKey="tab1">Tab 1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="tab2">Tab 2</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="tab3">Tab 3</Nav.Link>
                </Nav.Item>
            </Nav>

            <Tab.Content>
                <Tab.Pane eventKey="tab1">
                    <div>Content for Tab 1</div>
                    {/* Display details specific to Tab 1 */}
                </Tab.Pane>
                <Tab.Pane eventKey="tab2">
                    <div>Content for Tab 2</div>
                    {/* Display details specific to Tab 2 */}
                </Tab.Pane>
                <Tab.Pane eventKey="tab3">
                    <div>Content for Tab 3</div>
                    {/* Display details specific to Tab 3 */}
                </Tab.Pane>
            </Tab.Content>
        </>
    );
}

export default StudentAssignmentNavtabs;
