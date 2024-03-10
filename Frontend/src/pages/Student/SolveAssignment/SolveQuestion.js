import { useEffect } from "react";
import { Button } from 'react-bootstrap';
import QuestionDetailsPreview from '../../../components/CommonComponents/QuestionDetailsPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import CodeEditor from '../../../components/CodeEditor/CodeEditor';
import { useState } from "react";
import QuestionDetailsAccordion from "../../../components/Accordion/QuestionDetailsAccordion";
import DryRunModal from "../../../components/Modal/DryRunModal";
//Questions Array is an array of objects.

let DefaultSolutionCode =

    `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!";
    return 0;
}`;


function SolveQuestion({ Questions, AssignmentId }) {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [solutionCodes, setSolutionCodes] = useState([]);


    const handleNextQuestion = () => {
        if (Questions && currentQuestionIndex < Questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentQuestion(Questions[currentQuestionIndex + 1])
        }
    }

    const handlePreviousQuestion = () => {
        if (Questions && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setCurrentQuestion(Questions[currentQuestionIndex - 1])
        }
    };

    const handleUpdateCode = (code) => {
        // Update the corresponding solution code in the state
        const updatedSolutionCodes = [...solutionCodes];
        updatedSolutionCodes[currentQuestionIndex] = code;
        setSolutionCodes(updatedSolutionCodes);
    };

    useEffect(() => {
        if (Questions) {
            setCurrentQuestion(Questions[0])
            setSolutionCodes(Array(Questions.length).fill(DefaultSolutionCode));  //Generate an array of default solution codes for each question
        }
    }, [Questions])

    return (
        <>
            <div className="row my-3 rounded">
                <div className="col-4 text-center">
                    <Button variant="primary" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className='w-100'>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                </div>
                <div className="col-4 d-flex align-items-center justify-content-center rounded" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                    <span style={{ color: "white" }}>Question {currentQuestionIndex + 1}</span>
                </div>
                <div className="col-4 text-center">
                    <Button variant="primary" onClick={handleNextQuestion} disabled={currentQuestionIndex === Questions?.length - 1} className='w-100'>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Button>
                </div>
            </div>
            <div className="row" style={{ color: "white" }}>
                <QuestionDetailsAccordion Name={currentQuestion?.Name} CreatedOn={currentQuestion?.CreatedOn} />
            </div>

            <div className="row my-3">
                <div className="col">
                    <QuestionDetailsPreview QuestionName={currentQuestion?.QuestionName} ProblemStatement={currentQuestion?.ProblemStatement} Constraints={currentQuestion?.Constraints} InputFormat={currentQuestion?.InputFormat} OutputFormat={currentQuestion?.OutputFormat} SampleTestCases={currentQuestion?.TestCases} TimeLimitPerTestCase={1} MemoryLimitPerTestCase={30} />
                </div>
            </div>
            <div className="row my-3">
                <CodeEditor defaultCode={solutionCodes[currentQuestionIndex]} onUpdateCode={handleUpdateCode} />
            </div>
            <div className="row my-3">
                <div className="col">
                    <DryRunModal CodeToRun={solutionCodes[currentQuestionIndex]} AssignmentId={AssignmentId} QuestionId={currentQuestion?._id}/>
                </div>
                <div className="col">
                    <Button variant="primary" className="w-100">Submit</Button>
                </div>
            </div>
        </>
    );
}

export default SolveQuestion;