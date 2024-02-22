import React from "react";
import { Tab, Nav, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Button } from "react-bootstrap";

function CreateAssignmentNavtabs({ activeTab, Batches, MyQuestions, OtherQuestions }) {

    const [formData, setFormData] = useState({
        AssignmentName: "",
        PostedOn: "",
        Year: "",
        Batches: [],
        Questions: [],
    });

    const handleSubmit = () => {
        console.log(formData);
        // Perform further actions with formData, such as submitting to backend
    };

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

                        <hr />

                        <Form.Group as={Row} controlId="AssignmentName" className="mb-3 mt-3">
                            <Form.Label column sm={2}>Name:</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" placeholder="Enter assignment name" onChange={(e) => setFormData({ ...formData, AssignmentName: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <hr />

                        <Form.Group as={Row} controlId="PostedOn" className="mb-3">
                            <Form.Label column sm={4}>Date and Time:</Form.Label>
                            <Col sm={8}>
                                <Form.Control type="datetime-local" onChange={(e) => setFormData({ ...formData, PostedOn: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <hr />

                    </Tab.Pane>
                    <Tab.Pane eventKey="TargetStudents">

                        <hr />

                        <Form.Group as={Row} controlId="Year" className="mb-3 mt-3">
                            <Form.Label column sm={2}>Year:</Form.Label>
                            <Col sm={10}>
                                <Form.Check type="radio" label="First Year" id="First Year" name="Year" onChange={(e) => setFormData({ ...formData, Year: e.target.labels[0].innerText })} />
                                <Form.Check type="radio" label="Second Year" id="Second Year" name="Year" onChange={(e) => setFormData({ ...formData, Year: e.target.labels[0].innerText })} />
                                <Form.Check type="radio" label="Third Year" id="Third Year" name="Year" onChange={(e) => setFormData({ ...formData, Year: e.target.labels[0].innerText })} />
                                <Form.Check type="radio" label="Fourth Year" id="Fourth Year" name="Year" onChange={(e) => setFormData({ ...formData, Year: e.target.labels[0].innerText })} />
                            </Col>
                        </Form.Group>

                        <hr />

                        <Form.Group as={Row} controlId="batches" className="mb-3">
                            <Form.Label column sm={2}>Batches:</Form.Label>
                            <Col sm={10}>
                                {Batches.map((batch, index) => (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={batch}
                                        id={batch}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            if (isChecked) {
                                                // Add the batch to the Batches array
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    Batches: [...prevFormData.Batches, batch]
                                                }));
                                            } else {
                                                // Remove the batch from the Batches array
                                                setFormData((prevFormData) => ({
                                                    ...prevFormData,
                                                    Batches: prevFormData.Batches.filter(selectedBatch => selectedBatch !== batch)
                                                }));
                                            }
                                        }}
                                    />
                                ))}
                            </Col>
                        </Form.Group>

                        <hr />

                    </Tab.Pane>
                    <Tab.Pane eventKey="Questions">
                        <Tab.Container defaultActiveKey={"MyQuestions"}>
                            <Nav variant="tabs" fill>
                                <Nav.Item>
                                    <Nav.Link eventKey="MyQuestions">My Questions</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="OtherQuestions">Other Questions</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="MyQuestions">
                                    <hr />
                                    <Form.Group controlId="myQuestions" className="mt-3">
                                        {/* iterate over MyQuestions Array */}
                                        {MyQuestions.map((question, index) => (
                                            <Form.Check
                                                key={index}
                                                type="checkbox"
                                                label={question.QuestionName}
                                                id={question._id}
                                                className="mt-3"
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    if (isChecked) {
                                                        // Add the question _id to the Questions array
                                                        setFormData((prevFormData) => ({
                                                            ...prevFormData,
                                                            Questions: [...prevFormData.Questions, question._id]
                                                        }));
                                                    } else {
                                                        // Remove the question _id from the Questions array
                                                        setFormData((prevFormData) => ({
                                                            ...prevFormData,
                                                            Questions: prevFormData.Questions.filter(selectedQuestion => selectedQuestion !== question._id)
                                                        }));
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Form.Group>
                                    <hr />
                                </Tab.Pane>
                                <Tab.Pane eventKey="OtherQuestions">
                                    <hr />
                                    <Form.Group controlId="otherQuestions" className="mt-3">
                                        {/* iterate over OtherQuestions Array */}
                                        {OtherQuestions.map((question, index) => (
                                            <Form.Check
                                                key={index}
                                                type="checkbox"
                                                label={question.QuestionName}
                                                id={question._id}
                                                className="mt-3"
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    if (isChecked) {
                                                        // Add the question _id to the Questions array
                                                        setFormData((prevFormData) => ({
                                                            ...prevFormData,
                                                            Questions: [...prevFormData.Questions, question._id]
                                                        }));
                                                    } else {
                                                        // Remove the question _id from the Questions array
                                                        setFormData((prevFormData) => ({
                                                            ...prevFormData,
                                                            Questions: prevFormData.Questions.filter(selectedQuestion => selectedQuestion !== question._id)
                                                        }));
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Form.Group>
                                    <hr />
                                </Tab.Pane>
                            </Tab.Content>

                        </Tab.Container>
                        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                    </Tab.Pane>

                </Tab.Content>

            </Form>

        </Tab.Container>
    );
}

export default CreateAssignmentNavtabs;
