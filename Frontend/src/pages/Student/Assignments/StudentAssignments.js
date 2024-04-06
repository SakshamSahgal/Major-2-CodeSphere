import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import StudentAssignmentNavtabs from "./StudentAssignmentNavtabs";


function StudentAssignments() {
  return (
    <div>
      <NavbarWithProfileAndSidebar TabNames={["Assignments"]} TabLinks={["/students/assignments"]} ActiveTabIndex={0} />
      <div className="container">
        <div className="row my-3">
          <h1 style={{ color: 'white', textAlign: 'center' }}>Assignments</h1>
        </div>
        <div className="row">
          <StudentAssignmentNavtabs activeTab="pending" />
        </div>
      </div>
    </div>
  );
}

export default StudentAssignments;