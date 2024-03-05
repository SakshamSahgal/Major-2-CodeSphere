import { Form } from "react-bootstrap";
import CodeEditor from "../../../../../components/CodeEditor/CodeEditor";
import TestSolutionCodeModal from "../CodeTab/TestSolutionCodeModal/TestSolutionCodeModal";





function SolutionCodeTab({ formData, DefaultSolutionCode, handleInputChange }) {


    return (
        <Form.Group controlId="SolutionCode" className="my-3">
            <CodeEditor height={"500px"} defaultCode={DefaultSolutionCode} onUpdateCode={(codeWritten) => handleInputChange('SolutionCode', codeWritten)} isEditable={true} />
            <hr style={{ color: "white" }} />
            <TestSolutionCodeModal SolutionCodeToTest={formData.SolutionCode} />
            <hr style={{ color: "white" }} />
        </Form.Group>
    );
}

export default SolutionCodeTab;