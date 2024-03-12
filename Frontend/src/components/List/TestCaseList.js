import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ListGroup, Badge } from 'react-bootstrap';

const TestcaseList = ({ data }) => {
    const groupedData = {};

    // Group data by testcase number
    data.forEach(item => {
        const { testcase, verdict } = item;
        if (!groupedData[testcase]) {
            groupedData[testcase] = [];
        }
        groupedData[testcase].push(verdict === 'Failed' ? false : true);
    });

    // Render testcases with pass/fail indication
    const renderTestcases = () => {
        return Object.keys(groupedData).map(testcase => (
            <ListGroup.Item key={testcase}>
                Testcase {testcase}:
                {groupedData[testcase].every(result => result) ? (
                    <Badge variant="success" className="ml-2">
                        <FontAwesomeIcon icon={faCheckCircle} /> Passed
                    </Badge>
                ) : (
                    <Badge variant="danger" className="ml-2">
                        <FontAwesomeIcon icon={faTimesCircle} /> Failed
                    </Badge>
                )}
            </ListGroup.Item>
        ));
    };

    return (
        <ListGroup>
            {renderTestcases()}
        </ListGroup>
    );
};

export default TestcaseList;