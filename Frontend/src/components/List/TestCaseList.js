import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

function TestCaseList({ testCases }) {
    console.log(testCases);
    return (
        <div>
            <ListGroup>
                {testCases.map((testCase, index) => (
                    <ListGroup.Item key={index}>
                        Testcase : {testCase.testcase}{' '}
                        <Badge variant={testCase.verdict === 'Passed' ? 'success' : 'danger'}>
                            {testCase.verdict === 'Passed' ? (
                                <FontAwesomeIcon icon={faCheck} />
                            ) : (
                                <FontAwesomeIcon icon={faTimes} />
                            )}
                        </Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default TestCaseList;