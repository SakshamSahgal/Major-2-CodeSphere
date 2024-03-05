import { Form } from "react-bootstrap";
import CodeEditor from "../../../../components/CodeEditor/CodeEditor";
import RunRandomTestCaseCodeModal from "../RunRandomTestCaseCodeModal/RunRandomTestCaseCodeModal";
import { useState } from "react";

let DefaultCode =

    `#include <iostream>
#include <cstdlib>
#include <ctime>

using namespace std;

int main() {
    // Seed the random number generator with the current time
    srand(time(0));

    // Generate a random number between 1 and 99
    int randomNumber = rand() % 99 + 1;
    cout << randomNumber;

    return 0;
}`;

function RandomTestCaseCodeTab() {

    const [RandomTestCaseCode, setRandomTestCaseCode] = useState(DefaultCode);

    return (
        <>
            <Form.Group controlId="RandomTestCode" className="my-3">
                <CodeEditor height={"500px"} defaultCode={DefaultCode} onUpdateCode={(value) => { setRandomTestCaseCode(value) }} />
                <hr style={{ color: "white" }} />
                <RunRandomTestCaseCodeModal CodeToRun={RandomTestCaseCode} />
                <hr style={{ color: "white" }} />
            </Form.Group>
        </>
    )
}

export default RandomTestCaseCodeTab;