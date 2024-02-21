import { Nav, Tab } from 'react-bootstrap';
import { useState } from 'react';
import AssignmentList from './AssignmentList';

function StudentAssignmentNavtabs({ activeTab }) {
    // State to store the active tab
    const [currentTab, setCurrentTab] = useState(activeTab);

    // State to control the visibility of components
    const [showPending, setShowPending] = useState(currentTab === 'pending');
    const [showMissed, setShowMissed] = useState(currentTab === 'missed');
    const [showSubmitted, setShowSubmitted] = useState(currentTab === 'submitted');

    // Function to handle tab change
    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        setShowPending(tab === 'pending');
        setShowMissed(tab === 'missed');
        setShowSubmitted(tab === 'submitted');
    };

    return (
        <Tab.Container defaultActiveKey={activeTab}>
            <Nav variant="tabs" defaultActiveKey={activeTab} fill onSelect={handleTabChange}>
                <Nav.Item>
                    <Nav.Link eventKey="pending">Pending</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="missed">Missed</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="submitted">Submitted</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="pending" style={{ color: "white" }}>
                    {showPending && (
                        <AssignmentList listType={"Pending"} />
                    )}
                </Tab.Pane>
                <Tab.Pane eventKey="missed" style={{ color: "white" }}>
                    {showMissed && (
                        <AssignmentList listType={"Missed"}/>
                    )}
                </Tab.Pane>
                <Tab.Pane eventKey="submitted" style={{ color: "white" }}>
                    {showSubmitted && (
                        <AssignmentList listType={"Submitted"} />
                    )}
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>

    );
}

export default StudentAssignmentNavtabs;
