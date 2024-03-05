import { Form } from "react-bootstrap";
import CodeEditor from "../../../../../components/CodeEditor/CodeEditor";
import RunRandomTestCaseCodeModal from "../../NavTabs/CodeTab/RunRandomTestCaseCodeModal/RunRandomTestCaseCodeModal";




function RandomTestCaseCodeTab({ formData, DefaultRandomTestCode, handleInputChange }) {

    const handleToggleChange = (e) => {
        handleInputChange('RandomTestChecked', e.target.checked);
    };

    return (
        <>
            <Form.Group controlId="RandomTestToggle" className="py-3 d-flex justify-content-center" style={{ color: "white" }}>
                <Form.Check
                    type="switch"
                    id="randomTestToggle"
                    label="Random Test Case Generation"
                    checked={formData.RandomTestChecked}
                    onChange={handleToggleChange}
                    className="mb-3"
                />
            </Form.Group>

            <Form.Group controlId="RandomTestCode">
                <CodeEditor
                    height={"500px"}
                    defaultCode={DefaultRandomTestCode}
                    onUpdateCode={(codeWritten) => handleInputChange('RandomTestCode', codeWritten)}
                    isEditable={formData.RandomTestChecked}
                />
                <hr style={{ color: "white" }} />
                <RunRandomTestCaseCodeModal CodeToRun={formData.RandomTestCode} />
                <hr style={{ color: "white" }} />
            </Form.Group>

        </>
    );
}

export default RandomTestCaseCodeTab;