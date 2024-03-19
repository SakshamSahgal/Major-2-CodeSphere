import React from 'react';
import { ListGroup } from 'react-bootstrap';
import VerdictBadge from '../CommonComponents/VerdictBadge';

function GroupedResults({ results }) {
    // Grouping the results by Question
    console.log(results);
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
                <ListGroup>
                    {renderSubResults(subResults)}
                </ListGroup>
            </div>
        ));
    };

    // Rendering the sub-results (testcases)
    const renderSubResults = (subResults) => {
        return subResults.map((result, index) => (
            (result.type === "Verdict") ? (
                <ListGroup.Item key={index}>
                    <span>{result.testcase}</span> &nbsp;
                    <VerdictBadge verdict={result.verdict} />  &nbsp;
                    <span className="badge bg-dark" style={{ fontSize: '15px' }}>Score: {result.score}</span>
                </ListGroup.Item>
            ) : (
                <>
                    <hr />
                    <ListGroup.Item key={index} >
                        {result.message} {" "}
                        <VerdictBadge verdict={result.verdict} /> &nbsp;
                        <span className="badge  bg-primary" style={{ fontSize: '15px' }}>{" ["}{result.ScoreObtained}{"/"}{result.TotalScore}{"] "}</span>
                    </ListGroup.Item>
                    <hr />
                </>
            )
        ));
    };


    return (
        <div>
            {renderGroupedResults()}
        </div>
    );
}

export default GroupedResults;