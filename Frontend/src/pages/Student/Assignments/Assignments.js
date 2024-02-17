import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import RightsReservedFooter from "../../../components/Footer/RightsReservedFooter";
import StudentAssignmentNavtabs from "./StudentAssignmentNavtabs";

function Assignments() {
  return (
    <div>
      <NavbarWithProfileAndSidebar TabNames={["Assignments", "Evaluations"]} TabLinks={["/student/assignments", "/student/evaluations"]} />
      <h1>Assignments</h1>
      <div className="container">
      <StudentAssignmentNavtabs activeTab="tab1" handleTabChange={(tab) => console.log(tab)} />
      </div>
      <RightsReservedFooter />
    </div>
  );
}

export default Assignments;