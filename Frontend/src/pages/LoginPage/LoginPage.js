import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PlainNavbar from '../../components/Navbar/PlainNavbar';
import RightsReservedFooter from '../../components/Footer/RightsReservedFooter';
import LoginForm from './LoginForm';
import LoadingSpinner from '../../components/Spinners/Spinners';

//LoginType = 'Students' or 'Professors'
function LoginPage({ LoginType }) {

    const [formData, setFormData] = useState({
        Institution: '',
        Username: '',
        Password: '',
        LoginType: LoginType
    });

    const [Institutions, setInstitutions] = useState(null);


    // Handle Form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let response = await axios.post('/login', formData, { withCredentials: true });
            console.log(response.data);
            if (!response.data.success)
                toast.error(response.data.message);
            else {
                toast.success(response.data.message);
                localStorage.setItem(`${LoginType}Login`, true);
                window.location.href = `/${LoginType.toLowerCase()}/assignments`;
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
                // if the status if 401 then redirect to home
                if (error.response && error.response.status === 401) {
                    localStorage.clear(); //clear the local storage
                    window.location = "/"; //redirect to home
                }
                toast.error(`Error fetching Institution. Please try again later. err : ${error}`);
            }
        };

        fetchInstitutions();
    }, []);

    // Redirect to Assignments Page if already logged in
    if (localStorage.getItem(`${LoginType}Login`) === 'true') {
        window.location.href = `/${LoginType.toLowerCase()}/assignments`;
    }

    if (Institutions) {
        return (
            <>
                <PlainNavbar />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <div className="card align-items-center" style={{ backgroundColor: 'black', color: 'white' }}>
                        <div className="card-body">
                            <h5 className="card-title mb-4 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>{LoginType} LOGIN</h5>
                            <LoginForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} Institutions={Institutions} />
                        </div>
                    </div>
                </div>
                <RightsReservedFooter />
            </>
        );
    }
    else {
        return (
            <LoadingSpinner />
        )
    }

}

export default LoginPage;