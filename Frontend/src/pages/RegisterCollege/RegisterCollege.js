import PlainNavbar from "../../components/Navbar/PlainNavbar";
import RightsReservedFooter from "../../components/Footer/RightsReservedFooter";
import RegisterCollegeForm from "./RegisterCollegeForm";
import { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

function RegisterCollege() {

  const [formData, setFormData] = useState({
    CollegeName: '',
    Name: '',
    Email: '',
    PhoneNo: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      let response = await axios.post('/registerCollege', formData, { withCredentials: true });
      console.log(response.data);
      if (!response.data.success)
        toast.error(response.data.message);
      else {
        toast.success(response.data.message);
        //clear the form UI
        
      }
    }
    catch (error) {
      toast.error(`Error while Submitting Form: ${error}`);
    }
  };

  const handleInputChange = (event) => {
    console.log(formData)
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value
    });
  }


  return (
    <>
      <PlainNavbar />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card align-items-center" style={{ backgroundColor: 'black', color: 'white' }}>
          <div className="card-body">
            <h5 className="card-title mb-4 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>Register Your College</h5>
            <RegisterCollegeForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} />
          </div>
        </div>
      </div>
      <RightsReservedFooter />
    </>
  );
}

export default RegisterCollege;