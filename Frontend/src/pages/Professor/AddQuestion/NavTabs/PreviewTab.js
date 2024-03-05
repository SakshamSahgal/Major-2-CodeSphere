import { Card, ListGroup } from "react-bootstrap";
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from "@codemirror/lang-cpp";
import { githubDark } from '@uiw/codemirror-theme-github'; // GitHub theme
import InfoModal from "../../../../components/Modal/InfoModal"
import { toast } from "react-toastify";

function PreviewTab({ formData, FormMetaData }) {

    const HandleSubmit = (e) => {
        e.preventDefault(); // Prevents default refresh by the browser
        console.log("Submit");
        if (formData.QuestionName === "") {
            toast.error("Question Name is required");
        }
        if (formData.ProblemStatement === "") {
            toast.error("Problem Statement is required");
        }
        if (formData.Constraints === "") {
            toast.error("Constraints is required");
        }
        if (formData.InputFormat === "") {
            toast.error("Input Format is required");
        }
        if (formData.OutputFormat === "") {
            toast.error("Output Format is required");
        }
        if (formData.TestCases.length === 0) {
            toast.error("Test Cases are required");
        }
        else {
            if (!formData.TestCases.some(testcase => !testcase.sampleTestCase)) { // no object with sampleTestCase = false
                toast.error("Hidden Test Cases are required");
            }
            if (!formData.TestCases.some(testcase => testcase.sampleTestCase)) { //no object with sampleTestCase = true
                toast.error("Sample Test Cases are required");
            }
        }
        if(formData.SolutionCode === ""){
            toast.error("Solution Code is required");
        }
        if(formData.RandomTestChecked && formData.RandomTestCode === ""){
            toast.error("Random Test Code is required, if you have checked the Random Test Case Generator");
        }
    }

    return (
        <div>
            <div className="container">
                <div className="row my-3">
                    <div className="col">
                        <Card style={{ border: "none" }}>
                            <Card.Body>
                                {<div>
                                    <Card.Title style={{ textAlign: "center", fontSize: "25px" }}>
                                        {formData.QuestionName !== "" ? formData.QuestionName : "No Question Name provided"}
                                    </Card.Title>
                                    <Card.Subtitle style={{ textAlign: "center" }} className="mb-2 text-muted">
                                        time limit per test : 1 second
                                    </Card.Subtitle>
                                    <Card.Subtitle style={{ textAlign: "center" }} className="mb-2 text-muted">
                                        memory limit per test : {formData.QuestionName !== "" ? "30" : "256"} megabytes
                                    </Card.Subtitle>
                                    <hr />
                                </div>
                                }
                                {formData.ProblemStatement !== "" ? (
                                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", textAlign: "justify" }}>
                                        {formData.ProblemStatement}
                                    </pre>
                                ) : (
                                    <Card.Text>No Problem Statement provided</Card.Text>
                                )}
                                <br />
                                <div>
                                    <Card.Title>Constraints</Card.Title>
                                    {formData.Constraints !== "" ? (
                                        <pre>{formData.Constraints}</pre>
                                    ) : (
                                        <p>No constraints provided</p>
                                    )}
                                </div>
                                <br />
                                <div>
                                    <Card.Title>Input Format</Card.Title>
                                    {formData.InputFormat !== "" ? (
                                        <pre>{formData.InputFormat}</pre>
                                    ) : (
                                        <p>No InputFormat provided</p>
                                    )}
                                </div>
                                <br />
                                <div>
                                    <Card.Title>OutputFormat Format</Card.Title>
                                    {formData.OutputFormat !== "" ? (
                                        <pre>{formData.OutputFormat}</pre>
                                    ) : (
                                        <p>No OutputFormat provided</p>
                                    )}
                                </div>
                                <br />
                                <div>
                                    <Card.Title>Sample Test Cases <InfoModal info={FormMetaData.SampleTestCasesInfoModal} /></Card.Title>
                                    {formData.TestCases.some(testcase => testcase.sampleTestCase) ? (
                                        formData.TestCases.map((testcase, index) => (
                                            testcase.sampleTestCase && (
                                                <div key={index}>
                                                    Sample Test Case
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
                                    <Card.Title>Hidden Test Cases <InfoModal info={FormMetaData.HiddenTestCasesInfoModal} /></Card.Title>
                                    {formData.TestCases.some(testcase => !testcase.sampleTestCase) ? (
                                        formData.TestCases.map((testcase, index) => (
                                            !testcase.sampleTestCase && (
                                                <div key={index}>
                                                    Hidden Test Case
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
                                </div>


                                {formData.SolutionCode != "" ? (
                                    <div>
                                        <br />
                                        <Card.Title>Solution Code <InfoModal info={FormMetaData.SolutionInfoButtonDescription} /> </Card.Title>
                                        <CodeMirror
                                            value={formData.SolutionCode}
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

                                {formData.RandomTestChecked ? (
                                    <div>
                                        <br />
                                        <Card.Title>Random Test Case Generator <InfoModal info={FormMetaData.SolutionInfoButtonDescription} /> </Card.Title>
                                        <CodeMirror
                                            value={formData.RandomTestCode}
                                            theme={githubDark}
                                            extensions={[cpp()]}
                                            editable={false}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <br />
                                        <Card.Title>Random Test Case Generator <InfoModal info={FormMetaData.RandomTestCaseInfoButtonDescription} /> </Card.Title>
                                        <p>No Random Test Code Generator provided</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <button className="btn btn-primary w-100 mb-3" onClick={HandleSubmit}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreviewTab;