import React, { useEffect, useState } from "react";
import TestCase from "../TestCase"

function TestcasesTab({ handleInputChange }) {
    const [testcases, setTestcases] = useState([{ sampleTestCase: false, input: "" }]);

    //this will be called whenever the testcases array changes
    useEffect(() => {
        handleInputChange('TestCases', testcases);
    }, [testcases]);

    //function that adds a new testcase
    const addTestcase = () => {
        const newTestcases = [...testcases, { sampleTestCase: false, input: "" }];
        setTestcases(newTestcases);
    };

    //function that removes the last testcase
    const removeTestcase = () => {
        if (testcases.length === 1) return; // Ensure at least one testcase remains
        const newTestcases = testcases.slice(0, -1); // Remove the last testcase
        setTestcases(newTestcases);
    };

    //function that toggles the value of sampleTestCase
    const toggleSample = (index) => {
        const updatedTestcases = [...testcases];
        updatedTestcases[index].sampleTestCase = !updatedTestcases[index].sampleTestCase;
        setTestcases(updatedTestcases);
    };

    //function that updates the value of the testcase
    const updateTestcase = (index, input) => {
        const updatedTestcases = [...testcases];
        updatedTestcases[index].input = input;
        setTestcases(updatedTestcases);
    }

    return (
        <div style={{ color: "white" }}>
            <div className="container">
                <div className="row my-3">
                    <div className="col my-3">
                        <button type="button" className="btn btn-success w-100 h-100" onClick={addTestcase}>
                            Add Testcase
                        </button>
                    </div>
                    <div className="col my-3">
                        <button type="button" className="btn btn-danger w-100 h-100" onClick={removeTestcase}>
                            Remove Testcase
                        </button>
                    </div>
                </div>
                {testcases.map((testcase, index) => (
                    <div className="row my-1" key={index}>
                        <div className="col">
                            <TestCase
                                index={index}
                                toggleSample={toggleSample}
                                name={`Testcase ${index + 1}`}
                                isChecked={testcase.sampleTestCase}
                                input={testcase.input}
                                updateTestcase={updateTestcase}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TestcasesTab;
