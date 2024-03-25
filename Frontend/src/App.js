import LandingPage from './pages/LandingPage/LandingPage';
import RegisterCollege from './pages/RegisterCollege/RegisterCollege';
import StudentAssignments from './pages/Student/Assignments/StudentAssignments';
import ProfessorAssignments from './pages/Professor/Assignments/ProfessorAssignments';
import ProfessorAddQuestion from './pages/Professor/AddQuestion/ProfessorAddQuestion';
import ProfessorQuestions from './pages/Professor/Questions/ProfessorQuestions';
import SolveAssignment from './pages/Student/SolveAssignment/SolveAssignment';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Submissions from './pages/Professor/Submissions/Submissions';
import LoginPage from './pages/LoginPage/LoginPage';
import EvaluateSubmission from './pages/Professor/Submissions/EvaluateSubmission';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavTabs = ["Assignments", "AddQuestion", "Questions"];
const NavLinks = ["/professors/assignments", "/professors/addQuestion", "/professors/questions"];

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/professorlogin" element={<LoginPage LoginType={"Professors"} />} />
          <Route path="/studentlogin" element={<LoginPage LoginType={"Students"} />} />
          <Route path="/professors/assignments" element={<ProfessorAssignments NavTabs={NavTabs} NavLinks={NavLinks} />} />
          <Route path="/professors/addQuestion" element={<ProfessorAddQuestion activeTab={"Description"} NavTabs={NavTabs} NavLinks={NavLinks} />} />
          <Route path="/professors/questions" element={<ProfessorQuestions NavTabs={NavTabs} NavLinks={NavLinks} />} />
          <Route path="/students/assignments" element={<StudentAssignments />} /> {/*This Route is called when a student opens Assignments Page from sidebar */}
          <Route path="/students/solveAssignment/:_id" element={<SolveAssignment />} /> {/*This Route is called when a student clicks solve button on any pending assignment */}
          <Route path="/submissions/:AssignmentName/:_id" element={<Submissions />} />
          <Route path="/EvaluateSubmission/:_id" element={<EvaluateSubmission />} />
          <Route path="/registercollege" element={<RegisterCollege />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
