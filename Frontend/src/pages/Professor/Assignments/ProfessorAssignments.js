import RightsReservedFooter from '../../../components/Footer/RightsReservedFooter';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';
import CreatedAssignments from './CreatedAssignments';

function ProfessorAssignments() {
    return (
        <div>
            <NavbarWithProfileAndSidebar TabNames={["Assignments", "Evaluations"]} TabLinks={["/professors/assignments", "/professors/evaluations"]} LoginType={"Professors"} />
            <div className="container px-3">
                <div className="row my-3">
                    <h1 style={{ color: 'white', textAlign: 'center' }}>ASSIGNMENTS</h1>
                </div>
                <div className="row">
                    <div className="col text-center">
                        <button className='btn btn-primary'>Create Assignment</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <CreatedAssignments />
                    </div>
                </div>
            </div>
            <RightsReservedFooter />
        </div>
    )
}

export default ProfessorAssignments;