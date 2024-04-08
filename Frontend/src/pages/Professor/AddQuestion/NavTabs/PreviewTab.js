import { toast } from "react-toastify";
import axios from "axios";
import QuestionDetailsPreview from "../../../../components/CommonComponents/QuestionDetailsPreview";
import HiddenQuestionDetailsPreview from "../../../../components/CommonComponents/HiddenQuestionDetailsPreview";


function PreviewTab({ formData, FormMetaData }) {

    const HandleSubmit = async (e) => {
        e.preventDefault(); // Prevents default refresh by the browser
        console.log("Submit");
        let fail = false;
        if (formData.QuestionName === "") {
            toast.error("Question Name is required");
            fail = true;
        }
        if (formData.ProblemStatement === "") {
            toast.error("Problem Statement is required");
            fail = true;
        }
        if (formData.Constraints === "") {
            toast.error("Constraints is required");
            fail = true;
        }
        if (formData.InputFormat === "") {
            toast.error("Input Format is required");
            fail = true;
        }
        if (formData.OutputFormat === "") {
            toast.error("Output Format is required");
            fail = true;
        }
        if (formData.TestCases.length === 0) {
            toast.error("Test Cases are required");
            fail = true;
        }
        else {
            if (!formData.TestCases.some(testcase => !testcase.sampleTestCase)) { // no object with sampleTestCase = false
                toast.error("atleast one Hidden Test Case is required");
                fail = true;
            }
            if (!formData.TestCases.some(testcase => testcase.sampleTestCase)) { //no object with sampleTestCase = true
                toast.error("atleast one Sample Test Case is required");
                fail = true;
            }
        }
        if (formData.SolutionCode === "") {
            toast.error("Solution Code is required");
            fail = true;
        }
        if (formData.RandomTestChecked && formData.RandomTestCode === "") {
            toast.error("Random Test Code is required, if you have checked the Random Test Case Generator");
            fail = true;
        }

        if (!fail) { // if no error, means all fields are filled
            console.log("All fields are filled");
            console.log(formData);
            try {
                if (!formData.RandomTestChecked) { // if Random Test Case Generator is not checked, then RandomTestCode should be empty
                    formData.RandomTestCode = "";
                }
                const response = await axios.post("/professors/createQuestion", formData, { withCredentials: true });
                toast[response.data.success ? "success" : "error"](response.data.message);
                if (response.data.success) {
                    window.location.reload();
                }
            }
            catch (err) {
                console.log(err);
                toast.error(`Error while creating question: ${err}`);
            }
        }
    }

    return (
        <div>
            <div className="container">
                <div className="row my-3">
                    <div className="col">
                        <QuestionDetailsPreview QuestionName={formData.QuestionName} ProblemStatement={formData.ProblemStatement} Constraints={formData.Constraints} InputFormat={formData.InputFormat} OutputFormat={formData.OutputFormat} SampleTestCases={formData.TestCases.filter(testCase => testCase.sampleTestCase)} TimeLimitPerTestCase={5} MemoryLimitPerTestCase={30} FormMetaData={FormMetaData} />
                        <HiddenQuestionDetailsPreview HiddenTestCases={formData.TestCases.filter(testCase => !testCase.sampleTestCase)} SolutionCode={formData.SolutionCode} RandomTestChecked={formData.RandomTestChecked} RandomTestCode={formData.RandomTestCode} FormMetaData={FormMetaData}/>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <button className="btn btn-primary w-100 mb-3" onClick={HandleSubmit}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default PreviewTab;