import { Form, Row, Col, Tab } from 'react-bootstrap';
function OverviewTab({ formData, setFormData }) {

    return (
        <Tab.Pane eventKey="OverviewTab">
            <hr />
            <Form.Group as={Row} controlId="AssignmentName" className="mb-3 mt-3">
                <Form.Label column sm={2}>Name:</Form.Label>
                <Col sm={10}>
                    <Form.Control type="text" placeholder="Enter assignment name" onChange={(e) => setFormData({ ...formData, AssignmentName: e.target.value })} />
                </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} controlId="DueTimestamp" className="mb-3">
                <Form.Label column sm={4}>Due Date and Time:</Form.Label>
                <Col sm={8}>
                    <Form.Control type="datetime-local" onChange={(e) => setFormData({ ...formData, DueTimestamp: e.target.value })} />
                </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} controlId="AllowAIAssistance" className="mb-3 justify-content-center">
                <Col xs="auto">
                    <Form.Check
                        type="switch"
                        label="Allow AI Assistance"
                        onChange={(e) => setFormData({ ...formData, AIAssistance: e.target.checked })}
                    />
                </Col>
            </Form.Group>
            <hr />
        </Tab.Pane>
    )

}

export default OverviewTab;