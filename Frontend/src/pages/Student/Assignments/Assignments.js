import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import RightsReservedFooter from "../../../components/Footer/RightsReservedFooter";
function Assignments() {
  return (
    <div>
      <NavbarWithProfileAndSidebar TabNames={["Assignments","Evaluations"]} TabLinks={["/student/assignments","/student/evaluations"]} />
      <h1>Assignments</h1>
      <RightsReservedFooter />
    </div>
  );
}

export default Assignments;