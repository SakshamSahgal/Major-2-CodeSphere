import React, { useState } from 'react';
import PlainNavbar from "../../../components/Navbar/PlainNavbar";
import RightsReservedFooter from "../../../components/Footer/RightsReservedFooter";
import axios from 'axios';
import { useEffect } from 'react';
// Importing toastify module
import { toast } from "react-toastify";


function Studentlogin() {
    // State variables to store form data
    const [formData, setFormData] = useState({
        institution: '',
        Username: '',
        Password: '',
        loginType: 'Students'
    });
    const [institutions, setInstitutions] = useState([]);

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        try{
            let response = await axios.post('/login', formData)
            console.log(response.data);
            if(!response.data.success)
                toast.error(response.data.message);
            else
            {
                toast.success(response.data.message);
                window.location.href = '/student/assignments';
            }
        }
        catch(error){
            toast.error(`Error while Submitting Form: ${error}`);
        }
    };

    // Function to handle form input changes
    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await axios.get('/registeredColleges');
                console.log("Institutions:", response.data.result)
                setInstitutions(response.data.result);
            } catch (error) {
                toast.error(`Error fetching institutions. Please try again later. err : ${error}`);
            }
        };

        fetchInstitutions();
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    return (
        <>
            <PlainNavbar />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="card align-items-center" style={{ backgroundColor: 'black', color: 'white' }}>
                    <div className="card-body">
                        <h5 className="card-title mb-4 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>STUDENT LOGIN</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="institution" className="form-label">Institution</label>
                                <select className="form-select" id="institution" onChange={handleInputChange}>
                                    <option>Select Institution</option>
                                    {institutions.length && (institutions.map((institution) => (
                                        <option key={institution._id} value={institution.Name}>{institution.Name}</option>
                                    )))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Username" className="form-label">Username</label>
                                <input type="text" className="form-control" id="Username" placeholder="Enter Username" onChange={handleInputChange} autoComplete="Username" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Password" className="form-label">Password</label>
                                <input type="Password" className="form-control" id="Password" placeholder="Enter Password" autoComplete="current-Password" onChange={handleInputChange} />
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <RightsReservedFooter />
        </>
    );
}

export default Studentlogin;
