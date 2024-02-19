import { Nav, Tab } from 'react-bootstrap';
import { useState } from 'react';
import PendingAssignmentsList from './PendingAssignmentsList';
import MissingAssignmentsList from './MissingAssignmentsList';

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
        <Tab.Container id="nav-tabs-example" defaultActiveKey={activeTab}>
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
                        <>
                            <PendingAssignmentsList />
                        </>
                    )}
                </Tab.Pane>
                <Tab.Pane eventKey="missed" style={{ color: "white" }}>
                    {showMissed && (
                        <>
                            <MissingAssignmentsList />
                        </>
                    )}
                </Tab.Pane>
                <Tab.Pane eventKey="submitted" style={{ color: "white" }}>
                    {showSubmitted && (
                        <div>Submitted</div>
                    )}
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>

    );
}

// function StudentAssignmentNavtabs({ activeTab }) {
//     return (
//         <Tab.Container id="nav-tabs-example" defaultActiveKey={activeTab}>
//             <Nav variant="tabs" fill>
//                 <Nav.Item>
//                     <Nav.Link eventKey="tab1">Tab 1</Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item>
//                     <Nav.Link eventKey="tab2">Tab 2</Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item>
//                     <Nav.Link eventKey="tab3">Tab 3</Nav.Link>
//                 </Nav.Item>
//             </Nav>
//             <Tab.Content>
//                 <Tab.Pane eventKey="tab1" style={{ color: "white" }} >
//                     <h3>Tab 1 Content</h3>
//                     <p>This is the content of Tab 1.</p>
//                 </Tab.Pane>
//                 <Tab.Pane eventKey="tab2" style={{ color: "white" }} >
//                     <h3>Tab 2 Content</h3>
//                     <p>This is the content of Tab 2.</p>
//                 </Tab.Pane>
//                 <Tab.Pane eventKey="tab3" style={{ color: "white" }} >
//                     <h3>Tab 3 Content</h3>
//                     <p>This is the content of Tab 3.</p>
//                 </Tab.Pane>
//             </Tab.Content>
//         </Tab.Container>
//     );
// }

export default StudentAssignmentNavtabs;
