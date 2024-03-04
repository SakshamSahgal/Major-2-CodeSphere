import { Form } from "react-bootstrap";
import CharacterCounter from "../../../components/CommonComponents/CharacterCounter"; // Assuming CharacterCounter is in a separate file
import { useRef } from 'react';

function TestCase({ index, toggleSample, name, isChecked, updateTestcase }) {

    const textAreaRef = useRef(null);

    return (
        <Form.Group controlId={`inputTestcase${index + 1}`}>
            <Form.Label>{name}</Form.Label>
            <Form.Check
                type="switch"
                id={`sampleToggle${index + 1}`}
                label="Sample Testcase"
                checked={isChecked}
                onChange={() => toggleSample(index)} // Added onChange handler
                className="mb-3"
            />
            <Form.Control
                as="textarea"
                placeholder={name}
                maxLength={200}
                onChange={(e) => updateTestcase(index, e.target.value)} // Added onChange handler
                ref={textAreaRef}
            />
            <CharacterCounter
                maxLength={200}
                textAreaRef={textAreaRef}
                fontColor="white"
            />
        </Form.Group>
    );
}

export default TestCase;