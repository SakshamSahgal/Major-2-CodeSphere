import RightsReservedFooter from '../../../components/Footer/RightsReservedFooter';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';
import CreatedAssignments from './CreatedAssignments';
import CreateAssignmentModal from './CreateAssignmentModal';
function ProfessorAssignments() {
    return (
        <div>
            <NavbarWithProfileAndSidebar TabNames={["Assignments", "Evaluations","AddQuestion","Questions"]} TabLinks={["/professors/assignments", "/professors/evaluations","/professors/addQuestion","/professors/questions"]} LoginType={"Professors"} />
            <div className="container px-3">
                <div className="row my-3">
                    <h1 style={{ color: 'white', textAlign: 'center' }}>ASSIGNMENTS</h1>
                </div>
                <div className="row">
                    <div className="col">
                        <CreateAssignmentModal />
                    </div>
                </div>
                <div className="row">
                    <div className="col text-center">
                        <CreatedAssignments />
                    </div>
                </div>
            </div>
            <RightsReservedFooter />
        </div>
    )
}

export default ProfessorAssignments;