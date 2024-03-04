import React, { useState } from "react";
import { Form } from "react-bootstrap";

function SampleTestCasesTab() {


    const [testcases, setTestcases] = useState([`Testcase 1`]);

    const addTestcase = () => {
        const newTestcases = [...testcases, `Testcase ${testcases.length + 1}`];
        setTestcases(newTestcases);
    };

    const removeTestcase = () => {
        if (testcases.length === 1) return; // Ensure at least one testcase remains
        const newTestcases = testcases.slice(0, -1);
        setTestcases(newTestcases);
    };

    return (
        <div style={{ color: "white" }}>

            <div className="container">
                <div className="row my-3">
                    <div className="col text-center">
                        <h3>TestCases</h3>
                    </div>
                </div>
                <div className="row my-3">
                    <div className="col">
                        <button type="button" className="btn btn-success w-100" onClick={addTestcase}>
                            Add Testcase
                        </button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-danger w-100" onClick={removeTestcase}>
                            Remove Testcase
                        </button>
                    </div>
                </div>
                {testcases.map((testcase, index) => (
                    <div className="row" key={index}>
                        <div className="col">
                            <Form.Group controlId={`inputTestcase${index + 1}`}>
                                <Form.Label>{testcase}</Form.Label>
                                <Form.Control as="textarea" placeholder={testcase} />
                            </Form.Group>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SampleTestCasesTab;