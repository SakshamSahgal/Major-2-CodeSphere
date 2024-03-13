import React from 'react';
import { ListGroup } from 'react-bootstrap';
import VerdictBadge from '../CommonComponents/VerdictBadge';

//results is an array of objects, each object has a phase and a message
const StepsList = ({ results }) => {
    // Group results by type
    const groupedResults = results.reduce((acc, curr) => {
        acc[curr.type] = acc[curr.type] || [];
        acc[curr.type].push(curr);
        return acc;
    }, {});

    return (
        <div>
            {Object.keys(groupedResults).map((type, index) => (
                <div key={index}>
                    <hr />
                    <div>
                        <h3>{type}</h3>
                        <ListGroup>
                            {groupedResults[type].map((result, idx) => (
                                (result.type === "Verdict") ? (
                                    <ListGroup.Item key={idx} >
                                        {<>
                                            <span> {result.testcase}  : </span>
                                            <VerdictBadge verdict={result.verdict} /> &nbsp;
                                            <span className="badge  bg-dark" style={{ fontSize: '15px' }}> Score : {result.score}</span>
                                        </>
                                        }
                                    </ListGroup.Item>
                                ) : (
                                    <ListGroup.Item key={idx} >
                                        {result.message} {" "}
                                        <VerdictBadge verdict={result.verdict} /> &nbsp;
                                        <span className="badge  bg-primary" style={{ fontSize: '15px' }}>{" ["}{result.ScoreObtained}{"/"}{result.TotalScore}{"] "}</span>
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
