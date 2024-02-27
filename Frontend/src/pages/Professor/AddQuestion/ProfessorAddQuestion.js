import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import RightsReservedFooter from "../../../components/Footer/RightsReservedFooter";
import { Form, Nav, Tab } from "react-bootstrap";
import DescriptionTab from "./NavTabs/DescriptionTab";
import CodeTab from "./NavTabs/CodeTab";

function ProfessorAddQuestion({ activeTab }) {
  return (
    <>
      <NavbarWithProfileAndSidebar TabNames={["Assignments", "Evaluations", "AddQuestion", "Questions"]} TabLinks={["/professors/assignments", "/professors/evaluations", "/professors/addQuestion", "/professors/questions"]} LoginType={"Professors"} ActiveTabIndex={2} />
      <div className="container my-3">
        <div className="row">
          <div className="col text-center my-3">
            <h1 style={{ color: "white" }}>Add Question</h1>
          </div>
        </div>
        <div className="row">
          <Tab.Container defaultActiveKey={activeTab}>
            <Nav variant="tabs" defaultActiveKey={activeTab} fill>
              <Nav.Item>
                <Nav.Link eventKey="Description" style={{ fontSize : "20px" }}>Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Code" style={{ fontSize : "20px" }}>Code</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="TestCases" style={{ fontSize : "20px" }}>TestCases</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Preview" style={{ fontSize : "20px" }}>Preview</Nav.Link>
              </Nav.Item>
            </Nav>
            <Form>
              <Tab.Content>
                <Tab.Pane eventKey="Description" style={{ color: "white" }}>
                  <DescriptionTab />
                </Tab.Pane>
                <Tab.Pane eventKey="Code">
                  <CodeTab />
                </Tab.Pane>
                <Tab.Pane eventKey="TestCases">

                </Tab.Pane>
                <Tab.Pane eventKey="Preview">

                </Tab.Pane>
              </Tab.Content>
            </Form>
          </Tab.Container>
        </div>
      </div>
      {/* <RightsReservedFooter /> */}
    </>
  );
}

export default ProfessorAddQuestion;