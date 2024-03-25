import RightsReservedFooter from '../../../components/Footer/RightsReservedFooter';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';
import CreatedAssignments from './CreatedAssignments';
import CreateAssignmentModal from './CreateAssignmentModal';
function ProfessorAssignments({ NavTabs, NavLinks }) {
    return (
        <div>
            <NavbarWithProfileAndSidebar TabNames={NavTabs} TabLinks={NavLinks} ActiveTabIndex={0} />
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
        </div>
    )
}

export default ProfessorAssignments;