import { useParams } from 'react-router-dom';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import QuestionDetailsPreview from '../../../components/CommonComponents/QuestionDetailsPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import CodeEditor from '../../../components/CodeEditor/CodeEditor';

function SolveAssignment() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const questions = ["Question 1", "Question 2", "Question 3"]; // Example array of questions

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <>
            <NavbarWithProfileAndSidebar LoginType={"Student"} />
            <div className="container">
                <div className="row my-3 rounded">
                    <div className="col-4 text-center">
                        <Button variant="primary" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className='w-100'>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </Button>
                    </div>
                    <div className="col-4 d-flex align-items-center justify-content-center rounded" style={{backgroundColor : "rgba(255, 255, 255, 0.2)"}}>
                        <span style={{ color: "white" }}>Question {currentQuestionIndex + 1}</span>
                    </div>
                    <div className="col-4 text-center">
                        <Button variant="primary" onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1} className='w-100'>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </Button>
                    </div>
                </div>
                <div className="row my-3">
                    <div className="col">
                        <QuestionDetailsPreview />
                    </div>
                </div>
                <div className="row my-3">
                    <CodeEditor />
                </div>
            </div>
        </>
    );
}

export default SolveAssignment;

