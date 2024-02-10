import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import ProfessorLogin from './pages/Professor/LoginPage/ProfessorLogin';
import StudentLogin from './pages/Student/LoginPage/StudentLogin';
import RegisterCollege from './pages/RegisterCollege/RegisterCollege';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/professorlogin" element={<ProfessorLogin />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/registercollege" element={<RegisterCollege />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
