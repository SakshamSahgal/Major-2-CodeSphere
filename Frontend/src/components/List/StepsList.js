import React from 'react';
import { ListGroup } from 'react-bootstrap';
import VerdictBadge from '../CommonComponents/VerdictBadge';
//results is an array of objects, each object has a phase and a message
const StepsList = ({ results }) => {
    // Group results by phase
    const groupedResults = results.reduce((acc, curr) => {
        acc[curr.phase] = acc[curr.phase] || [];
        acc[curr.phase].push(curr);
        return acc;
    }, {});

    return (
        <div>
            {Object.keys(groupedResults).map((phase, index) => (
                <div key={index}>
                    <hr />
                    <div>
                        <h3>{phase}</h3>
                        <ListGroup>
                            {groupedResults[phase].map((result, idx) => (
                                (result.phase === "Verdict") ? (
                                    <ListGroup.Item key={idx} >
                                        {<>
                                            <span>Testcase {result.testcase}  : </span>
                                            <VerdictBadge verdict={result.verdict} />
                                        </>
                                        }
                                    </ListGroup.Item>
                                ) : (
                                    <ListGroup.Item key={idx} >
                                        {` ${result.message}`} {" "}
                                        <VerdictBadge verdict={result.verdict} />
                                    </ListGroup.Item>
                                )
                            ))}
                        </ListGroup>
                    </div>
                    <hr />
                </div>
            ))
            }
        </div>
    );
};

export default StepsList;
