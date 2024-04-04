import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import { Tab, Nav } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import QuestionsList from "./QuestionsList";

function ProfessorQuestions({ NavTabs, NavLinks }) {

    return (
        <>
            <NavbarWithProfileAndSidebar TabNames={NavTabs} TabLinks={NavLinks} ActiveTabIndex={2} />
            <div className="container my-3">
                <div className="row">
                    <div className="col">
                        <Tab.Container defaultActiveKey="MyQuestions">
                            <Nav variant="tabs" fill>
                                <Nav.Item>
                                    <Nav.Link eventKey="MyQuestions">My Questions</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="OtherQuestions">Other Questions</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="MyQuestions">
                                    <QuestionsList apiRoute="/professors/getMyQuestions" type={"MyQuestions"} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="OtherQuestions">
                                    <hr />
                                    <ListGroup>
                                        <QuestionsList apiRoute="/professors/getOtherQuestions" type={"OtherQuestions"} />
                                    </ListGroup>
                                    <hr />
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfessorQuestions;
