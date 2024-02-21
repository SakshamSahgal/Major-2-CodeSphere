import React from "react";
import { Tab, Nav, Form, Row, Col } from "react-bootstrap";

function CreateAssignmentNavtabs({ activeTab, Batches }) {
    return (
        <Tab.Container defaultActiveKey={activeTab}>
            <Nav variant="tabs" defaultActiveKey={activeTab} fill>
                <Nav.Item>
                    <Nav.Link eventKey="OverviewTab">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="TargetStudents">Target Students</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="Questions">Questions</Nav.Link>
                </Nav.Item>
            </Nav>
            <Form>
                <Tab.Content>
                    <Tab.Pane eventKey="OverviewTab">
                        <Form.Group as={Row} controlId="assignmentName">
                            <Form.Label column sm={2}>Assignment Name:</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" placeholder="Enter assignment name" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="dateTime">
                            <Form.Label column sm={2}>Date and Time:</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="datetime-local" />
                            </Col>
                        </Form.Group>
                    </Tab.Pane>
                    <Tab.Pane eventKey="TargetStudents">
                        <Form.Group as={Row} controlId="year">
                            <Form.Label column sm={2}>Year:</Form.Label>
                            <Col sm={10}>
                                <Form.Check type="radio" label="First Year" id="First Year" name="year" />
                                <Form.Check type="radio" label="Second Year" id="Second Year" name="year" />
                                <Form.Check type="radio" label="Third Year" id="Third Year" name="year" />
                                <Form.Check type="radio" label="Fourth Year" id="Fourth Year" name="year" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="batches">
                            <Form.Label column sm={2}>Batches:</Form.Label>
                            <Col sm={10}>
                                {/* iterate over the batches Array */}
                                {Batches.map((batch, index) => (
                                    <Form.Check key={index} type="checkbox" label={batch} id={batch} />
                                ))}
                            </Col>
                        </Form.Group>
                    </Tab.Pane>
                    <Tab.Pane eventKey="Questions">
                        <Form.Group controlId="questions">
                            <Form.Label>Questions:</Form.Label>
                            <Form.Check type="checkbox" label="Question 1" id="question1" />
                            <Form.Check type="checkbox" label="Question 2" id="question2" />
                            <Form.Check type="checkbox" label="Question 3" id="question3" />
                            {/* Add more checkboxes for other questions if needed */}
                        </Form.Group>
                    </Tab.Pane>
                </Tab.Content>
            </Form>

        </Tab.Container>
    );
}

export default CreateAssignmentNavtabs;
