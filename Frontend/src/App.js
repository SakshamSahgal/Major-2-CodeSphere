import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProfessorLogin from './pages/ProfessorLogin';
import StudentLogin from './pages/StudentLogin';
import RegisterCollege from './pages/RegisterCollege';


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
