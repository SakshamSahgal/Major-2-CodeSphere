import { Form } from "react-bootstrap";
import CodeEditor from "../../../../components/CodeEditor/CodeEditor";
import TestSolutionCodeModal from "../TestSolutionCodeModal/TestSolutionCodeModal";
import { useState } from "react";

let DefaultCode =

    `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!";
    return 0;
}`;


function SolutionCodeTab() {

    const [SolutionCodeToTest, setSolutionCodeToTest] = useState(DefaultCode);

    return (
        <Form.Group controlId="SolutionCode" className="my-3">
            <CodeEditor height={"500px"} defaultCode={DefaultCode} onUpdateCode={(value) => { setSolutionCodeToTest(value) }} />
            <hr style={{ color: "white" }} />
            <TestSolutionCodeModal SolutionCodeToTest={SolutionCodeToTest} />
            <hr style={{ color: "white" }} />
        </Form.Group>
    );
}

export default SolutionCodeTab;