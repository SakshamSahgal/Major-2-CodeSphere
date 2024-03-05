import { Form } from "react-bootstrap";
import CodeEditor from "../../../../components/CodeEditor/CodeEditor";
import TestSolutionCodeModal from "../TestSolutionCodeModal/TestSolutionCodeModal";
import { useState } from "react";




function SolutionCodeTab({ formData, DefaultSolutionCode, handleInputChange }) {


    return (
        <Form.Group controlId="SolutionCode" className="my-3">
            <CodeEditor height={"500px"} defaultCode={DefaultSolutionCode} onUpdateCode={(codeWritten) => handleInputChange('SolutionCode', codeWritten)} />
            <hr style={{ color: "white" }} />
            <TestSolutionCodeModal SolutionCodeToTest={formData.SolutionCode} />
            <hr style={{ color: "white" }} />
        </Form.Group>
    );
}

export default SolutionCodeTab;