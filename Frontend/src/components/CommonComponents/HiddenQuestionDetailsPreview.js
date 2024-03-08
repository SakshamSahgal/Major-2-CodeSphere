import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import InfoModal from "../Modal/InfoModal";
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from "@codemirror/lang-cpp";
import { githubDark } from '@uiw/codemirror-theme-github'; // GitHub theme


function HiddenQuestionDetailsPreview({ HiddenTestCases, SolutionCode, RandomTestChecked, RandomTestCode, FormMetaData }) {
    return (
        <Card style={{ border: "none" }} className="my-3">
            <Card.Body>
                <Card.Title>Hidden Test Cases <InfoModal info={FormMetaData?.HiddenTestCasesInfoModal} /></Card.Title>
                {HiddenTestCases.length ? (
                    HiddenTestCases.map((testcase, index) => (
                        (
                            <div key={index}>
                                Hidden Test Case {index}
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
                    <p>No hidden test cases provided</p>
                )}
                {SolutionCode != "" ? (
                    <div>
                        <br />
                        <Card.Title>Solution Code <InfoModal info={FormMetaData?.SolutionInfoButtonDescription} /> </Card.Title>
                        <CodeMirror
                            value={SolutionCode}
                            theme={githubDark}
                            extensions={[cpp()]}
                            editable={false}
                        />
                    </div>
                ) : (
                    <div>
                        <br />
                        <Card.Title>Solution Code</Card.Title>
                        <p>No Solution Code Provided</p>
                    </div>
                )}

                {RandomTestChecked ? (
                    <div>
                        <br />
                        <Card.Title>Random Test Case Generator <InfoModal info={FormMetaData?.SolutionInfoButtonDescription} /> </Card.Title>
                        <CodeMirror
                            value={RandomTestCode}
                            theme={githubDark}
                            extensions={[cpp()]}
                            editable={false}
                        />
                    </div>
                ) : (
                    <div>
                        <br />
                        <Card.Title>Random Test Case Generator <InfoModal info={FormMetaData?.RandomTestCaseInfoButtonDescription} /> </Card.Title>
                        <p>No Random Test Code Generator provided</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default HiddenQuestionDetailsPreview;