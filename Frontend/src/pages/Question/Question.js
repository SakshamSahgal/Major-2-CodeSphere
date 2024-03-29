import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import fetchAPI from '../../Scripts/Axios';
import { Tab, Nav, Form } from "react-bootstrap";
import QuestionDetailsPreview from '../../components/CommonComponents/QuestionDetailsPreview';
import HiddenQuestionDetailsPreview from '../../components/CommonComponents/HiddenQuestionDetailsPreview';
import { convertIsoToNormalTime, getTimeElapsed } from '../../Scripts/TimeFunctions';
import NavbarWithProfileAndSidebar from '../../components/Navbar/NavbarWithProfileAndSidebar';
import { Card, Row, Col } from 'react-bootstrap';

//type can be Public or Full
//if type is public then only the question details will be displayed
//if type is full then the question details along with the answer and hidden testcases will be displayed
//the server will return the full question details only if the user is a professor
//the server will return the public question details only if the user is a student

function Question() {

    const { _id } = useParams();
    const { type } = useParams();

    const [Question, setQuestion] = useState(null);

    useEffect(() => {
        const fetchQuestionDetails = async () => {
            try {
                const response = await fetchAPI(`/Get${type}Question/${_id}`);
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setQuestion(response.data.Question);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(`Error while fetching submission details, error: ${error.message}`);
            }
        };

        fetchQuestionDetails();
    }, [_id]);
    return (
        <>
            <NavbarWithProfileAndSidebar />
            {(Question === null) ? (
                <p>Loading...</p>
            ) : (
                <div className="container my-3">
                    <div className="row">
                        <div className="col">
                            <Tab.Container defaultActiveKey={"Description"}>
                                <Nav variant="tabs" fill>
                                    <Nav.Item>
                                        <Nav.Link eventKey="Description" style={{ fontSize: "20px" }}>Description</Nav.Link>
                                    </Nav.Item>
                                    {(type === "Full") && <Nav.Item>
                                        <Nav.Link eventKey="Evaluation" style={{ fontSize: "20px" }}>Evaluation</Nav.Link>
                                    </Nav.Item>}
                                    <Nav.Item>
                                        <Nav.Link eventKey="Origin" style={{ fontSize: "20px" }}>Origin</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Form>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="Description" style={{ color: "white" }}>
                                            <QuestionDetailsPreview QuestionName={Question.QuestionName} ProblemStatement={Question.ProblemStatement} Constraints={Question.Constraints} InputFormat={Question.InputFormat} OutputFormat={Question.OutputFormat} SampleTestCases={Question.TestCases.filter(TestCase => TestCase.sampleTestCase)} TimeLimitPerTestCase={1} MemoryLimitPerTestCase={30} />
                                        </Tab.Pane>
                                        {(type === "Full") && <Tab.Pane eventKey="Evaluation">
                                            <HiddenQuestionDetailsPreview HiddenTestCases={Question.TestCases.filter(TestCase => !TestCase.sampleTestCase)} SolutionCode={Question.SolutionCode} RandomTestChecked={Question.RandomTestChecked} RandomTestCode={Question.RandomTestCode} />
                                        </Tab.Pane>}
                                        <Tab.Pane eventKey="Origin">
                                            <div className="container text-center">
                                                <Row>
                                                    <Col>
                                                        <Card style={{ border: "none" }} className="my-3">
                                                            <Card.Body>
                                                                <div className="mb-1">
                                                                    <strong>Created By:</strong> {Question?.CreatedBy.Name} <br />
                                                                    <strong>Created On:</strong>{" "}
                                                                    {convertIsoToNormalTime(Question?.CreatedOn).date}{" "}
                                                                    {convertIsoToNormalTime(Question?.CreatedOn).time}{" "}
                                                                    <span className="text-muted">[ {getTimeElapsed(Question?.CreatedOn)} ]</span>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Form>
                            </Tab.Container>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}

export default Question;