import LandingPage from './pages/LandingPage/LandingPage';
import RegisterCollege from './pages/RegisterCollege/RegisterCollege';
import StudentAssignments from './pages/Student/Assignments/StudentAssignments';
import ProfessorAssignments from './pages/Professor/Assignments/ProfessorAssignments';
import Evaluations from './pages/Student/Evaluations/Evaluations';
import ProfessorAddQuestion from './pages/Professor/AddQuestion/ProfessorAddQuestion';
import ProfessorQuestions from './pages/Professor/Questions/ProfessorQuestions';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import LoginPage from './pages/LoginPage/LoginPage';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/professorlogin" element={<LoginPage LoginType={"Professors"} />} />
          <Route path="/studentlogin" element={<LoginPage LoginType={"Students"} />} />
          <Route path="/professors/assignments" element={<ProfessorAssignments />} />
          <Route path="/professors/addQuestion" element={<ProfessorAddQuestion activeTab={"Description"} />} />
          <Route path="/professors/questions" element={<ProfessorQuestions />} />
          <Route path="/students/assignments" element={<StudentAssignments />} />
          <Route path="/students/evaluations" element={<Evaluations />} />
          <Route path="/registercollege" element={<RegisterCollege />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
