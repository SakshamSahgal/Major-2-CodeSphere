import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import RightsReservedFooter from "../../../components/Footer/RightsReservedFooter";

function ProfessorAddQuestion() {
  return (
    <>
      <NavbarWithProfileAndSidebar TabNames={["Assignments", "Evaluations", "AddQuestion", "Questions"]} TabLinks={["/professors/assignments", "/professors/evaluations", "/professors/addQuestion", "/professors/questions"]} LoginType={"Professors"} />
      <RightsReservedFooter />
    </>
  );
}

export default ProfessorAddQuestion;