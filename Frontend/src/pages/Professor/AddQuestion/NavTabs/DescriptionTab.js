import { useRef } from 'react';
import { Form } from "react-bootstrap";
import CharacterCounter from "../../../../components/CommonComponents/CharacterCounter";

function DescriptionTab({ handleInputChange, formData }) {

    const questionNameRef = useRef(null);
    const problemStatementRef = useRef(null);
    const ConstraintsRef = useRef(null);
    const InputFormatRef = useRef(null);
    const OutputFormatRef = useRef(null);
    return (
        <>
            <div className="container">

                <Form.Group controlId="QuestionName" className="my-3">
                    <Form.Label>Question Name *</Form.Label>
                    <Form.Control defaultValue={formData.QuestionName} type="text" placeholder="Enter question name" ref={questionNameRef} maxLength={50} onChange={(e) => handleInputChange('QuestionName', e.target.value)} />
                    <CharacterCounter maxLength={50} textAreaRef={questionNameRef} fontColor={'white'} />
                </Form.Group>

                <Form.Group controlId="ProblemStatement" className="my-3">
                    <Form.Label>Problem Statement *</Form.Label>
                    <Form.Control defaultValue={formData.ProblemStatement} as="textarea" rows={6} placeholder="Enter problem statement" ref={problemStatementRef} maxLength={1800} onChange={(e) => handleInputChange('ProblemStatement', e.target.value)} />
                    <CharacterCounter maxLength={1800} textAreaRef={problemStatementRef} fontColor={'white'} />
                </Form.Group>

                <Form.Group controlId="Constraints" className="my-3">
                    <Form.Label>Constraints *</Form.Label>
                    <Form.Control defaultValue={formData.Constraints} as="textarea" rows={3} placeholder="Enter constraints..." ref={ConstraintsRef} maxLength={500} onChange={(e) => handleInputChange('Constraints', e.target.value)} />
                    <CharacterCounter maxLength={500} textAreaRef={ConstraintsRef} fontColor={'white'} />
                </Form.Group>

                <Form.Group controlId="InputFormat" className="my-3">
                    <Form.Label>Input Format *</Form.Label>
                    <Form.Control defaultValue={formData.InputFormat} as="textarea" rows={3} placeholder="Enter Input Format..." ref={InputFormatRef} maxLength={500} onChange={(e) => handleInputChange('InputFormat', e.target.value)} />
                    <CharacterCounter maxLength={500} textAreaRef={InputFormatRef} fontColor={'white'} />
                </Form.Group>

                <Form.Group controlId="OutputFormat" className="my-3">
                    <Form.Label>Output Format *</Form.Label>
                    <Form.Control defaultValue={formData.OutputFormat} as="textarea" rows={3} placeholder="Enter Output Format..." ref={OutputFormatRef} maxLength={500} onChange={(e) => handleInputChange('OutputFormat', e.target.value)} />
                    <CharacterCounter maxLength={500} textAreaRef={OutputFormatRef} fontColor={'white'} />
                </Form.Group>

            </div>
        </>
    );
}


export default DescriptionTab;
