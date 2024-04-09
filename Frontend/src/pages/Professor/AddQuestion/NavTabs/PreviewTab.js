import { toast } from "react-toastify";
import axios from "axios";
import QuestionDetailsPreview from "../../../../components/CommonComponents/QuestionDetailsPreview";
import HiddenQuestionDetailsPreview from "../../../../components/CommonComponents/HiddenQuestionDetailsPreview";


function PreviewTab({ formData, FormMetaData, editQuestion = false, _id }) {

    const validateForm = () => {
        if (formData.QuestionName === "") {
            toast.error("Question Name is required");
            return true;
        }
        if (formData.ProblemStatement === "") {
            toast.error("Problem Statement is required");
            return true;
        }
        if (formData.Constraints === "") {
            toast.error("Constraints is required");
            return true;
        }
        if (formData.InputFormat === "") {
            toast.error("Input Format is required");
            return true;
        }
        if (formData.OutputFormat === "") {
            toast.error("Output Format is required");
            return true;
        }
        if (formData.TestCases.length === 0) {
            toast.error("Test Cases are required");
            return true;
        } else {
            if (!formData.TestCases.some(testcase => !testcase.sampleTestCase)) { // no object with sampleTestCase = false
                toast.error("atleast one Hidden Test Case is required");
                return true;
            }
            if (!formData.TestCases.some(testcase => testcase.sampleTestCase)) { //no object with sampleTestCase = true
                toast.error("atleast one Sample Test Case is required");
                return true;
            }
        }
        if (formData.SolutionCode === "") {
            toast.error("Solution Code is required");
            return true;
        }
        if (formData.RandomTestChecked && formData.RandomTestCode === "") {
            toast.error("Random Test Code is required, if you have checked the Random Test Case Generator");
            return true;
        }
        return false;
    }

    const HandleSubmit = async (e) => {
        e.preventDefault(); // Prevents default refresh by the browser
        console.log("Submit");
        if (validateForm()) return; // Reuse validation logic
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
        } catch (err) {
            console.log(err);
            toast.error(`Error while creating question: ${err}`);
        }
    }

    const HandleUpdate = async (e) => {
        e.preventDefault(); // Prevents default refresh by the browser
        console.log("Update");
        if (validateForm()) return; // Reuse validation logic
        console.log("All fields are filled");
        console.log(formData);
        try {
            if (!formData.RandomTestChecked) { // if Random Test Case Generator is not checked, then RandomTestCode should be empty
                formData.RandomTestCode = "";
            }
            formData._id = _id;
            const response = await axios.put("/professors/updateQuestion", formData, { withCredentials: true });
            toast[response.data.success ? "success" : "error"](response.data.message);
            if (response.data.success) {
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            toast.error(`Error while updating question: ${err}`);
        }
    }


    return (
        <div>
            <div className="container">
                <div className="row my-3">
                    <div className="col">
                        <QuestionDetailsPreview QuestionName={formData.QuestionName} ProblemStatement={formData.ProblemStatement} Constraints={formData.Constraints} InputFormat={formData.InputFormat} OutputFormat={formData.OutputFormat} SampleTestCases={formData.TestCases.filter(testCase => testCase.sampleTestCase)} TimeLimitPerTestCase={5} MemoryLimitPerTestCase={30} FormMetaData={FormMetaData} />
                        <HiddenQuestionDetailsPreview HiddenTestCases={formData.TestCases.filter(testCase => !testCase.sampleTestCase)} SolutionCode={formData.SolutionCode} RandomTestChecked={formData.RandomTestChecked} RandomTestCode={formData.RandomTestCode} FormMetaData={FormMetaData} />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        {editQuestion ? <button className="btn btn-primary w-100 mb-3" onClick={HandleUpdate}>Update</button> : <button className="btn btn-primary w-100 mb-3" onClick={HandleSubmit}>Create</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default PreviewTab;