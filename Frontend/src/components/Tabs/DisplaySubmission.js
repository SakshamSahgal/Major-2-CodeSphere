import React from 'react';
import { Tab, Nav } from 'react-bootstrap';
import CodeEditor from '../CodeEditor/CodeEditor';

function DisplaySubmission({ submissions = null }) {

    if (!submissions) return (<h1>Loading...</h1>);

    return (
        <Tab.Container id="submissions-tab" defaultActiveKey={0}>
            <Nav variant="tabs">
                {submissions.map((submission, index) => (
                    <Nav.Item key={index}>
                        <Nav.Link eventKey={index}>{submission.QuestionId}</Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            <Tab.Content>
                {submissions.map((submission, index) => (
                    <Tab.Pane key={index} eventKey={index}>
                        <p>Question ID: {submission.QuestionId}</p>
                        <CodeEditor defaultCode={submission.SubmittedCode} isEditable={false}/>
                        <p>Score Obtained: {submission.ScoreObtained}</p>
                        <p>Total Score: {submission.TotalScore}</p>
                    </Tab.Pane>
                ))}
            </Tab.Content>
        </Tab.Container>
    )
}

export default DisplaySubmission;