import { Form, Nav, Tab } from 'react-bootstrap';
import CodeEditor from '../../../../components/CodeEditor/CodeEditor';

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
                        <CodeEditor height="500px" />
                    </Form.Group>
                </Tab.Pane>
                <Tab.Pane eventKey="RandomTestCode">
                    <Form.Group controlId="randomTestCode" className="my-3">
                        <CodeEditor height="500px" />
                    </Form.Group>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    );
}

export default CodeTab;
