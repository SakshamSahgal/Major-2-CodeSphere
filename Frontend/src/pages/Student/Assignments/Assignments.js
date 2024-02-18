import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import RightsReservedFooter from "../../../components/Footer/RightsReservedFooter";
import StudentAssignmentNavtabs from "./StudentAssignmentNavtabs";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Assignments() {

  const [PendingAssignments, setPendingAssignments] = useState([]);
  const [MissedAssignments, setMissedAssignments] = useState([]);
  const [SubmittedAssignments, setSubmittedAssignments] = useState([]);

  useEffect(() => {
    const fetchPendingAssignments = async () => {
      try {
        const response = await axios.get('/students/assignments/pending', { withCredentials: true });
        console.log(response.data);
        if (response.data.success) {
          toast.success(response.data.message);
          setPendingAssignments(response.data.Assignments);
        }
        else
          toast.error(response.data.message);
      } catch (error) {
        toast.error(`Error fetching Pending Assignments. Please try again later. err : ${error}`);
      }
    };
    const fetchMissedAssignments = async () => {
      try {
        const response = await axios.get('/students/assignments/missed', { withCredentials: true });
        console.log(response.data);
        if (response.data.success) {
          toast.success(response.data.message);
          setMissedAssignments(response.data.Assignments);
        }
        else
          toast.error(response.data.message);
      } catch (error) {
        toast.error(`Error fetching Missed Assignments. Please try again later. err : ${error}`);
      }
    };
    const fetchSubmittedAssignments = async () => {
      try {
        const response = await axios.get('/students/assignments/submitted', { withCredentials: true });
        console.log(response.data);
        if (response.data.success) {
          toast.success(response.data.message);
          setSubmittedAssignments(response.data.Assignments);
        }
        else
          toast.error(response.data.message);
      } catch (error) {
        toast.error(`Error fetching Submitted Assignments. Please try again later. err : ${error}`);
      }
    };

    fetchPendingAssignments();
    fetchMissedAssignments();
    fetchSubmittedAssignments();
  }, [])

  return (
    <div>
      <NavbarWithProfileAndSidebar TabNames={["Assignments", "Evaluations"]} TabLinks={["/student/assignments", "/student/evaluations"]} />
      <div className="container">
        <div className="row my-3">
          <h1 style={{ color: 'white', textAlign: 'center' }}>Assignments</h1>
        </div>
        <div className="row">
          <StudentAssignmentNavtabs activeTab="Pending" />
        </div>
      </div>
      <RightsReservedFooter />
    </div>
  );
}

export default Assignments;