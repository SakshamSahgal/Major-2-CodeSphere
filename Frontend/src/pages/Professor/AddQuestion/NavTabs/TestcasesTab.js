import React, { useState } from "react";
import TestCase from "./../TestCase";

function TestcasesTab() {
    const [testcases, setTestcases] = useState([{ name: "Testcase 1", isSample: false, value: "" }]);
    // console.log(testcases);

    //function that adds a new testcase
    const addTestcase = () => {
        const newTestcases = [...testcases, { name: `Testcase ${testcases.length + 1}`, isSample: false, value: ""}];
        setTestcases(newTestcases);
    };

    //function that removes the last testcase
    const removeTestcase = () => {
        if (testcases.length === 1) return; // Ensure at least one testcase remains
        const newTestcases = testcases.slice(0, -1); // Remove the last testcase
        setTestcases(newTestcases);
    };

    //function that toggles the value of isSample
    const toggleSample = (index) => {
        const updatedTestcases = [...testcases];
        updatedTestcases[index].isSample = !updatedTestcases[index].isSample;
        setTestcases(updatedTestcases);
    };

    //function that updates the value of the testcase
    const updateTestcase = (index, value) => {
        const updatedTestcases = [...testcases];
        updatedTestcases[index].value = value;
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
                    <div className="row" key={index}>
                        <div className="col">
                            <TestCase
                                index={index}
                                toggleSample={toggleSample}
                                name={testcase.name}
                                isChecked={testcase.isSample}
                                value={testcase.value}
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
