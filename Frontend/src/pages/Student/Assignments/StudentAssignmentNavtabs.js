import { Nav, Tab } from 'react-bootstrap';

//activeTab is the current active tab
//handleTabChange is the function to handle the tab change

function StudentAssignmentNavtabs({ activeTab, PendingAssignments, MissedAssignments, SubmittedAssignments }) {
    return (
        <>
            <Nav variant="tabs" defaultActiveKey={activeTab} fill>
                <Nav.Item>
                    <Nav.Link eventKey="Pending">Pending</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="Missed">Missed</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="Submitted">Submitted</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="Pending">
                    <div>Pending</div>
                    {/* Display details specific to Tab 1 */}
                </Tab.Pane>
                <Tab.Pane eventKey="Missed">
                    <div>Missed</div>
                    {/* Display details specific to Tab 2 */}
                </Tab.Pane>
                <Tab.Pane eventKey="Submitted">
                    <div>Submitted</div>
                    {/* Display details specific to Tab 3 */}
                </Tab.Pane>
            </Tab.Content>
        </>
    );
}

export default StudentAssignmentNavtabs;
