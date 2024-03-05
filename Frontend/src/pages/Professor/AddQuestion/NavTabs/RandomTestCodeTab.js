import { Form } from "react-bootstrap";
import CodeEditor from "../../../../components/CodeEditor/CodeEditor";
import RunRandomTestCaseCodeModal from "../RunRandomTestCaseCodeModal/RunRandomTestCaseCodeModal";



function RandomTestCaseCodeTab({ formData, DefaultRandomTestCode, handleInputChange }) {

    return (
        <>
            <Form.Group controlId="RandomTestCode" className="my-3">
                <CodeEditor height={"500px"} defaultCode={DefaultRandomTestCode} onUpdateCode={(codeWritten) => handleInputChange('RandomTestCode', codeWritten)} />
                <hr style={{ color: "white" }} />
                <RunRandomTestCaseCodeModal CodeToRun={formData.RandomTestCode} />
                <hr style={{ color: "white" }} />
            </Form.Group>
        </>
    )
}

export default RandomTestCaseCodeTab;