import React from 'react';
import { Accordion } from 'react-bootstrap';
import { convertIsoToNormalTime, getTimeElapsed } from '../../Scripts/TimeFunctions';


function QuestionDetailsAccordion({ Name = "", CreatedOn }) {
    return (
        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header className="text-center my-3" style={{ cursor: 'pointer' }}>
                    <h5>Question Details</h5>
                </Accordion.Header>

                <Accordion.Body>
                    <p className="card-text">
                        <strong>Created By : </strong>
                        <span className="value">{Name}</span>
                    </p>
                    <p className="card-text">
                        <strong>Created On : </strong>
                        <span className="value">{convertIsoToNormalTime(CreatedOn).date}</span>
                        <span className="value">{convertIsoToNormalTime(CreatedOn).time}</span>
                    </p>
                    <p className="card-text">
                        <strong>Time Elapsed : </strong>
                        <span className="value">{getTimeElapsed(CreatedOn)}</span>
                    </p>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default QuestionDetailsAccordion;