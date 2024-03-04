import { useRef } from 'react';
import { Form } from "react-bootstrap";
import CharacterCounter from "../../../../components/CommonComponents/CharacterCounter";

function DescriptionTab() {

    const questionNameRef = useRef(null);
    const problemStatementRef = useRef(null);
    const constraintsRef = useRef(null);


    return (
        <>
            <Form.Group controlId="questionName" className="my-3">
                <Form.Label>Question Name</Form.Label>
                <Form.Control type="text" placeholder="Enter question name" ref={questionNameRef} maxLength={50}/>
                <CharacterCounter maxLength={50} textAreaRef={questionNameRef} fontColor={'white'} />
            </Form.Group>

            <Form.Group controlId="problemStatement" className="my-3">
                <Form.Label>Problem Statement</Form.Label>
                <Form.Control as="textarea" rows={6} placeholder="Enter problem statement" ref={problemStatementRef} maxLength={1000}/>
                <CharacterCounter maxLength={1000} textAreaRef={problemStatementRef} fontColor={'white'} />
            </Form.Group>

            <Form.Group controlId="constraints" className="my-3">
                <Form.Label>Constraints</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter constraints" ref={constraintsRef} maxLength={500} />
                <CharacterCounter maxLength={500} textAreaRef={constraintsRef} fontColor={'white'} />
            </Form.Group>
        </>
    );
}


export default DescriptionTab;
