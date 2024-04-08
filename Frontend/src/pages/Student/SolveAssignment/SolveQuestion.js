import { useEffect } from "react";
import { Button } from 'react-bootstrap';
import QuestionDetailsPreview from '../../../components/CommonComponents/QuestionDetailsPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import CodeEditor from '../../../components/CodeEditor/CodeEditor';
import { useState } from "react";
import QuestionDetailsAccordion from "../../../components/Accordion/QuestionDetailsAccordion";
import DryRunModal from "../../../components/Modal/DryRunModal";
import CodeScore from "../../../components/CommonComponents/CodeScore";
import AIAssistanceModal from "../../../components/Modal/AIAssistanceModal"
//Questions Array is an array of objects.



//Questions is an array of objects with each object having the following structure
// const QuestionSchema = new mongoose.Schema({
//     Constraints: { type: String, required: true, maxlength: 500 },
//     InputFormat: { type: String, required: true, maxlength: 500 },
//     OutputFormat: { type: String, required: true, maxlength: 500 },
//     ProblemStatement: { type: String, required: true, maxlength: 1800 },
//     QuestionName: { type: String, required: true, unique: true, maxlength: 50 },
//     RandomTestCode: { type: String, required: false },
//     SolutionCode: { type: String, required: true },
//     TestCases: [{
//         input: { type: String, required: true },
//         sampleTestCase: { type: Boolean, required: true },
//     }],
//     RandomTestChecked: { type: Boolean, required: true },
//     CreatedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
//     CreatedOn: { type: Date, required: true },
// });

function SolveQuestion({ Questions, AssignmentId, UserCodes, setUserCodes }) {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);

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
        const updatedUserCodes = [...UserCodes];
        updatedUserCodes[currentQuestionIndex].UserCode = code;
        setUserCodes(updatedUserCodes);
    };

    useEffect(() => {
        if (Questions) {
            setCurrentQuestion(Questions[0])
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
                <QuestionDetailsAccordion Name={currentQuestion?.CreatedBy.Name} CreatedOn={currentQuestion?.CreatedOn} />
            </div>

            <div className="row">
                <div className="col">
                    <QuestionDetailsPreview QuestionName={currentQuestion?.QuestionName} ProblemStatement={currentQuestion?.ProblemStatement} Constraints={currentQuestion?.Constraints} InputFormat={currentQuestion?.InputFormat} OutputFormat={currentQuestion?.OutputFormat} SampleTestCases={currentQuestion?.TestCases} TimeLimitPerTestCase={5} MemoryLimitPerTestCase={30} />
                </div>
            </div>
            <div className="row my-3">
                <CodeScore Code={UserCodes[currentQuestionIndex].UserCode} />
                <CodeEditor defaultCode={UserCodes[currentQuestionIndex].UserCode} onUpdateCode={handleUpdateCode} />
            </div>
            <div className="row my-3">
                <div className="col">
                    <DryRunModal CodeToRun={UserCodes[currentQuestionIndex].UserCode} AssignmentId={AssignmentId} QuestionId={currentQuestion?._id} />
                </div>
                <div className="col">
                    <AIAssistanceModal />
                </div>
            </div>
        </>
    );
}

export default SolveQuestion;