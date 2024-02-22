import { Form, Row, Col, Tab } from 'react-bootstrap';


// TargetStudentsTab component
function TargetStudentsTab({ formData, setFormData, Batches }) {
    return (
        <Tab.Pane eventKey="TargetStudents">
            <hr />
            <Form.Group as={Row} controlId="Year" className="mb-3 mt-3">
                <Form.Label column sm={2}>Year:</Form.Label>
                <Col sm={10}>
                    <Form.Check type="radio" label="First Year" id="First Year" name="Year" onChange={(e) => setFormData({ ...formData, Year: e.target.labels[0].innerText })} />
                    <Form.Check type="radio" label="Second Year" id="Second Year" name="Year" onChange={(e) => setFormData({ ...formData, Year: e.target.labels[0].innerText })} />
                    <Form.Check type="radio" label="Third Year" id="Third Year" name="Year" onChange={(e) => setFormData({ ...formData, Year: e.target.labels[0].innerText })} />
                    <Form.Check type="radio" label="Fourth Year" id="Fourth Year" name="Year" onChange={(e) => setFormData({ ...formData, Year: e.target.labels[0].innerText })} />
                </Col>
            </Form.Group>
            <hr />
            <Form.Group as={Row} controlId="batches" className="mb-3">
                <Form.Label column sm={2}>Batches:</Form.Label>
                <Col sm={10}>
                    {Batches.map((batch, index) => (
                        <Form.Check
                            key={index}
                            type="checkbox"
                            label={batch}
                            id={batch}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                if (isChecked) {
                                    // Add the batch to the Batches array
                                    setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        Batches: [...prevFormData.Batches, batch]
                                    }));
                                } else {
                                    // Remove the batch from the Batches array
                                    setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        Batches: prevFormData.Batches.filter(selectedBatch => selectedBatch !== batch)
                                    }));
                                }
                            }}
                        />
                    ))}
                </Col>
            </Form.Group>
            <hr />
        </Tab.Pane>
    )
}



export default TargetStudentsTab;