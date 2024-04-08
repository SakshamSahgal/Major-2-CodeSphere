import { useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';


function AIAssistanceTabs({activeTab = "Improvement"}) {


    const handleTabChange = (tab) => {
        console.log(tab);
    }

    useEffect(() => {
        handleTabChange();
    }, []);


    return (
        <Tab.Container defaultActiveKey={activeTab}>
            <Nav variant="tabs" defaultActiveKey={activeTab} fill onSelect={handleTabChange}>
                <Nav.Item>
                    <Nav.Link eventKey="Improvement">Improvement</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="Alt-Approaches">Alt-Approaches</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="Errors">Errors</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="Improvement">
                    Improvement
                </Tab.Pane>
                <Tab.Pane eventKey="Alt-Approaches">
                    Alt-Approaches
                </Tab.Pane>
                <Tab.Pane eventKey="Errors">
                    Errors
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    );
}

export default AIAssistanceTabs;