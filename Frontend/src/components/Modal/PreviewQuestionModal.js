import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Form, Nav, Tab } from "react-bootstrap";
import QuestionDetailsPreview from '../CommonComponents/QuestionDetailsPreview';
import { getTimeElapsed, convertIsoToNormalTime } from '../../Scripts/TimeFunctions';
import { Row, Col } from 'react-bootstrap';
import HiddenQuestionDetailsPreview from '../CommonComponents/HiddenQuestionDetailsPreview';
import fetchAPI  from '../../Scripts/Axios';

//This is a modal that will be used to preview the question when the user clicks on any Question in the QuestionsList
function PreviewQuestionModal({ show, onClose, _id }) {

    const [Question, setQuestion] = useState(null);

    useEffect(() => {
        const fetchQuestionDetails = async () => {
            try {
                const response = await fetchAPI(`/professors/getQuestionDetails/${_id}`);
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setQuestion(response.data.Question);
                } else {
                    toast.error(response.data.message);
                }
            } catch (err) {
                toast.error(`error while fetching question details, error ${err.message}`);
            }
        };

        // Fetch question details only when the modal is opened
        if (show) {
            fetchQuestionDetails();
        }
    }, [show, _id]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Body>

                {(Question === null) ? (
                    <p>Loading...</p>
                ) : (
                    <Tab.Container defaultActiveKey={"Description"}>
                        <Nav variant="tabs" fill>
                            <Nav.Item>
                                <Nav.Link eventKey="Description" style={{ fontSize: "20px" }}>Description</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Evaluation" style={{ fontSize: "20px" }}>Evaluation</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Origin" style={{ fontSize: "20px" }}>Origin</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Form>
                            <Tab.Content>
                                <Tab.Pane eventKey="Description" style={{ color: "white" }}>
                                    <QuestionDetailsPreview QuestionName={Question.QuestionName} ProblemStatement={Question.ProblemStatement} Constraints={Question.Constraints} InputFormat={Question.InputFormat} OutputFormat={Question.OutputFormat} SampleTestCases={Question.TestCases.filter(TestCase => TestCase.sampleTestCase)} TimeLimitPerTestCase={1} MemoryLimitPerTestCase={30} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Evaluation">
                                    <HiddenQuestionDetailsPreview HiddenTestCases={Question.TestCases.filter(TestCase => !TestCase.sampleTestCase)} SolutionCode={Question.SolutionCode} RandomTestChecked={Question.RandomTestChecked} RandomTestCode={Question.RandomTestCode} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Origin">
                                    <div className="container text-center">
                                        <Row className='my-3'>
                                            <Col>
                                                <p className="mb-1"><strong>Created By:</strong> {Question?.CreatedBy.Name}</p>
                                            </Col>
                                        </Row>
                                        <Row className='my-3'>
                                            <Col>
                                                <p className="mb-1">
                                                    <strong>Created On:</strong>
                                                    {" "}
                                                    {convertIsoToNormalTime(Question?.CreatedOn).date}{" "}
                                                    {convertIsoToNormalTime(Question?.CreatedOn).time}{" "}
                                                    <span className="text-muted">[ {getTimeElapsed(Question?.CreatedOn)} ]</span>
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Form>
                    </Tab.Container>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PreviewQuestionModal;