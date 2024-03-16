import React from 'react';
import { Card } from 'react-bootstrap';

function GroupedResults({ results }) {
    // Grouping the results by Question
    const groupedResults = results.reduce((acc, obj) => {
        const key = obj.Question;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});

    // Rendering the grouped results
    const renderGroupedResults = () => {
        return Object.entries(groupedResults).map(([question, subResults], index) => (
            <div key={index}>
                <h2>{question}</h2>
                <ul>
                    {renderSubResults(subResults)}
                </ul>
            </div>
        ));
    };

    // Rendering the sub-results (testcases)
    const renderSubResults = (subResults) => {
        return subResults.map((result, index) => (
            <li key={index}>
                <Card bg="light" text="dark" style={{ marginBottom: '10px' }}>
                    <Card.Body>
                        <Card.Title>{result.testcase}</Card.Title>
                        <Card.Text>
                            <strong>Verdict:</strong> {result.verdict}<br />
                            <strong>Message:</strong> {result.message}<br />
                            <strong>Score:</strong> {result.score}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </li>
        ));
    };

    return (
        <div>
            {renderGroupedResults()}
        </div>
    );
}

export default GroupedResults;