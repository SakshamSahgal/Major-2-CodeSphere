import LandingPage from './pages/LandingPage/LandingPage';
import ProfessorLogin from './pages/Professor/LoginPage/ProfessorLogin';
import StudentLogin from './pages/Student/LoginPage/StudentLogin';
import RegisterCollege from './pages/RegisterCollege/RegisterCollege';
import Assignments from './pages/Student/Assignments/Assignments';
import Evaluations from './pages/Student/Evaluations/Evaluations';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/professorlogin" element={<ProfessorLogin />} />
          {/* <Route path="/professor/assignments" element={<Assignments />} /> */}
          <Route path="/studentlogin" element={<StudentLogin />} />
          <Route path="/student/assignments" element={<Assignments />} />
          <Route path="/student/evaluations" element={<Evaluations />} />
          <Route path="/registercollege" element={<RegisterCollege />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
