import React from 'react';
import { Accordion } from 'react-bootstrap';
import { convertIsoToNormalTime, getTimeElapsed } from '../../Scripts/TimeFunctions';


function AssignmentDetailsAccordion({ PostedOn, DueTimestamp, Batches = [], Year, NumberOfQuestions }) {
    return (

        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header className="text-center my-3" style={{ cursor: 'pointer' }}>
                    <h4>Assignment Details</h4>
                </Accordion.Header>

                <Accordion.Body>
                    <p className="card-text">
                        <strong>Posted On:</strong>{" "}
                        {convertIsoToNormalTime(PostedOn).date}{" "}
                        {convertIsoToNormalTime(PostedOn).time}{" "}
                        <span className="text-muted">[ {getTimeElapsed(PostedOn)} ] </span>
                    </p>
                    <p className="card-text">
                        <strong>Due Timestamp:</strong>{" "}
                        {convertIsoToNormalTime(DueTimestamp).date}{" "}
                        {convertIsoToNormalTime(DueTimestamp).time}{" "}
                        <span className="text-muted">[ {getTimeElapsed(DueTimestamp)} ]</span>
                    </p>
                    <p className="card-text">
                        <strong>Batches:</strong>{" "}
                        {Batches.map((batch, batchIndex) => (
                            <span key={batchIndex} className="badge bg-secondary mx-1">
                                {batch}
                            </span>
                        ))}
                    </p>
                    <p className='card-text'>
                        <strong>Year:</strong>{" "}
                        <span className="badge bg-success mx-1">{Year}</span>
                    </p>
                    <p className='card-text'>
                        <strong>Questions :</strong>{" "}
                        <span className="badge bg-success mx-1">{NumberOfQuestions}</span>
                    </p>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default AssignmentDetailsAccordion;