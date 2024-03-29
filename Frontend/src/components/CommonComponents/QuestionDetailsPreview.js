import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import InfoModal from "../Modal/InfoModal";


function QuestionDetailsPreview({ QuestionName, ProblemStatement, Constraints, InputFormat, OutputFormat, SampleTestCases, TimeLimitPerTestCase, MemoryLimitPerTestCase, FormMetaData }) {
    return (
        <Card style={{ border: "none" }} className="my-3">
            <Card.Body>
                {<div>
                    <Card.Title style={{ textAlign: "center", fontSize: "25px" }}>
                        {QuestionName && QuestionName !== "" ? QuestionName : "No Question Name provided"}
                    </Card.Title>
                    <Card.Subtitle style={{ textAlign: "center" }} className="mb-2 text-muted">
                        time limit per test : {TimeLimitPerTestCase ? TimeLimitPerTestCase : "0"} second
                    </Card.Subtitle>
                    <Card.Subtitle style={{ textAlign: "center" }} className="mb-2 text-muted">
                        memory limit per test : {MemoryLimitPerTestCase ? MemoryLimitPerTestCase : "0"} megabytes
                    </Card.Subtitle>
                    <hr />
                </div>
                }
                {ProblemStatement && ProblemStatement !== "" ? (
                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", textAlign: "justify" }}>
                        {ProblemStatement}
                    </pre>
                ) : (
                    <Card.Text>No Problem Statement provided</Card.Text>
                )}
                <br />
                <div>
                    <Card.Title>Constraints</Card.Title>
                    {Constraints && Constraints !== "" ? (
                        <pre>{Constraints}</pre>
                    ) : (
                        <p>No constraints provided</p>
                    )}
                </div>
                <br />
                <div>
                    <Card.Title>Input Format</Card.Title>
                    {InputFormat && InputFormat !== "" ? (
                        <pre>{InputFormat}</pre>
                    ) : (
                        <p>No Input Format provided</p>
                    )}
                </div>
                <br />
                <div>
                    <Card.Title>Output Format</Card.Title>
                    {OutputFormat !== "" ? (
                        <pre>{OutputFormat}</pre>
                    ) : (
                        <p>No OutputFormat provided</p>
                    )}
                </div>
                <br />
                <div>
                    <Card.Title>Sample Test Cases <InfoModal info={FormMetaData?.SampleTestCasesInfoModal} /></Card.Title>
                    {SampleTestCases?.length ? (
                        SampleTestCases.map((testcase, index) => (
                            testcase.sampleTestCase && (
                                <div key={index}>
                                    Sample Test Case {index}
                                    <Card>
                                        <ListGroup variant="flush" className="px-1">
                                            <ListGroup.Item>
                                                <div>
                                                    <pre>{testcase.input}</pre>
                                                </div>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </div>
                            )
                        ))
                    ) : (
                        <p>No sample test cases provided</p>
                    )}
                    <br />

                </div>
            </Card.Body>
        </Card>
    );
}

export default QuestionDetailsPreview;