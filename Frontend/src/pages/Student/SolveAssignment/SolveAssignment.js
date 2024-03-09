import { useParams } from 'react-router-dom';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import QuestionDetailsPreview from '../../../components/CommonComponents/QuestionDetailsPreview';
import ProgressBar from 'react-bootstrap/ProgressBar';


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
                <div className="row my-3">
                    <div className="col-6 text-center">
                        <Button variant="primary" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className='w-100'>Previous</Button>
                    </div>
                    {/* <div className="col-10 text-center">
                        <h2 style={{ color: "white" }}>Question {currentQuestionIndex + 1}</h2>
                    </div> */}
                    <div className="col-6 text-center">
                        <Button variant="primary" onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1} className='w-100'>Next</Button>
                    </div>
                </div>
                <div className="row my-3">
                    <div className="col">
                        <QuestionDetailsPreview />
                    </div>
                </div>
            </div>

        </>
    );
}

export default SolveAssignment;

