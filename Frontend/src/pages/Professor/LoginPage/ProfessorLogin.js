import PlainNavbar from "../../../components/Navbar/PlainNavbar";
import RightsReservedFooter from "../../../components/Footer/RightsReservedFooter";
import ProfessorLoginForm from "./ProfessorLoginForm";
import axios from 'axios';
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

function ProfessorLogin() {

    const [ProfessorLoggedIn, setProfessorLoggedIn] = useState(false); //redirect to assignments page if already logged in
    const [formData, setFormData] = useState({
        Institution: '',
        Username: '',
        Password: '',
        LoginType: 'Professors'
    });

    const [Institutions, setInstitutions] = useState([]);

    // Check if Professor is already logged in
    useEffect(() => {
        if (localStorage.getItem('ProfessorsLogin')) {
            setProfessorLoggedIn(true);
        }
    }, []);

    // Handle Form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let response = await axios.post('/login', formData, { withCredentials: true });
            console.log(response);
            if (!response.data.success)
                toast.error(response.data.message);
            else {
                toast.success(response.data.message);
                localStorage.setItem('ProfessorsLogin', true);
                setProfessorLoggedIn(true);
            }
        }
        catch (error) {
            toast.error(`Error while Submitting Form: ${error}`);
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    // Fetching Institutions
    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await axios.get('/registeredColleges');
                setInstitutions(response.data.result);
            } catch (error) {
                toast.error(`Error fetching Institution. Please try again later. err : ${error}`);
            }
        };
        fetchInstitutions();
    }, []);

    if (ProfessorLoggedIn) {
        window.location.href = "/professor/assignments";
    }

    return (
        <>
            <PlainNavbar />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="card align-items-center" style={{ backgroundColor: 'black', color: 'white' }}>
                    <div className="card-body">
                        <h5 className="card-title mb-4 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>PROFESSOR LOGIN</h5>
                        <ProfessorLoginForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} Institutions={Institutions} />
                    </div>
                </div>
            </div>
            <RightsReservedFooter />
        </>
    );
}

export default ProfessorLogin;