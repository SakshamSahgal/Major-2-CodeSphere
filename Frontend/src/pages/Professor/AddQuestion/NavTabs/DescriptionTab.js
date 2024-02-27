
import { Form } from "react-bootstrap";

function DescriptionTab() {
    return (
        <>
            <Form.Group controlId="questionName" className="my-3">
                <Form.Label>Question Name</Form.Label>
                <Form.Control type="text" placeholder="Enter question name" />
            </Form.Group>

            <Form.Group controlId="problemStatement" className="my-3">
                <Form.Label>Problem Statement</Form.Label>
                <Form.Control as="textarea" rows={6} placeholder="Enter problem statement" />
            </Form.Group>

            <Form.Group controlId="constraints" className="my-3">
                <Form.Label>Constraints</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter constraints" />
            </Form.Group>
        </>
    );
}

export default DescriptionTab;
