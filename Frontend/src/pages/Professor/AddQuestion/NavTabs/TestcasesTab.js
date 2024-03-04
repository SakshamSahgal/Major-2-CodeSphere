import SampleTestCasesTab from './SampleTestCases';
import { Nav, Tab } from 'react-bootstrap';

function TestcasesTab({ activeTab }) {

    return (
        <Tab.Container defaultActiveKey={activeTab}>
            <Nav variant="tabs" defaultActiveKey={activeTab} fill className="my-3">
                <Nav.Item>
                    <Nav.Link eventKey="SampleTestCases" style={{ fontSize: "20px" }}>SampleTestCases</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="HiddenTestCases" style={{ fontSize: "20px" }}>HiddenTestCases</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="SampleTestCases" style={{ color: "white" }}>
                    <SampleTestCasesTab />
                </Tab.Pane>
                <Tab.Pane eventKey="HiddenTestCases">

                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>

    );
}

export default TestcasesTab;
