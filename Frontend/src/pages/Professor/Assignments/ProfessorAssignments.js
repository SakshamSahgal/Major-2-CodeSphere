import RightsReservedFooter from '../../../components/Footer/RightsReservedFooter';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';


function ProfessorAssignments(){
    return(
        <div>
            <NavbarWithProfileAndSidebar TabNames={["Assignments", "Evaluations"]} TabLinks={["/professors/assignments", "/professors/evaluations"]} LoginType={"Professors"} />
            <RightsReservedFooter />
        </div>
    )
}

export default ProfessorAssignments;