import { useState } from "react";
import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
// import RightsReservedFooter from "../../../components/Footer/RightsReservedFooter";
import { Form, Nav, Tab } from "react-bootstrap";
import DescriptionTab from "./NavTabs/DescriptionTab";
import CodeTab from "./NavTabs/CodeTab/CodeTab";
import TestcasesTab from "./NavTabs/TestcasesTab";
import PreviewTab from "./NavTabs/PreviewTab";

let DefaultSolutionCode =

  `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!";
    return 0;
}`;

let DefaultRandomTestCode =

  `#include <iostream>
#include <cstdlib>
#include <ctime>

using namespace std;

int main() {
    // Seed the random number generator with the current time
    srand(time(0));

    // Generate a random number between 1 and 99
    int randomNumber = rand() % 99 + 1;
    cout << randomNumber;

    return 0;
}`;

function ProfessorAddQuestion({ activeTab }) {

  const [formData, setFormData] = useState({
    QuestionName: '',
    ProblemStatement: '',
    Constraints: "",
    InputFormat: "",
    OutputFormat: "",
    SolutionCode: DefaultSolutionCode,
    RandomTestChecked: false,
    RandomTestCode: DefaultRandomTestCode,
    TestCases: [] // testCases is an array of objects with properties input, name, isChecked
  });

  const FormMetaData = {
    SolutionCodeTabDescription: `This Code will be used to evaluate correct Output for Testcases`,
    SolutionInfoButtonDescription: `This Code will be used to evaluate correct Output for Testcases`,
    RandomTestCodeTabDescription: `This Code will be used to generate random Testcases,\n please ensure that the code you provide here matches the input format`,
    RandomTestCaseInfoButtonDescription: `This Code will be used to generate random Testcases,\n please ensure that the code you provide here matches the input format`,
    HiddenTestCasesInfoModal: "These are the testcases That will not be visible to the user, and will be used for evaluation, make sure they exactly match the input format",
    SampleTestCasesInfoModal: "These are the testcases That will be visible to the user, and will be used for evaluation, make sure they exactly match the input format"
  }

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  console.log(formData);

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
            <Nav variant="tabs" fill>
              <Nav.Item>
                <Nav.Link eventKey="Description" style={{ fontSize: "20px" }}>Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Code" style={{ fontSize: "20px" }}>Code</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="TestCases" style={{ fontSize: "20px" }}>TestCases</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Preview" style={{ fontSize: "20px" }}>Preview</Nav.Link>
              </Nav.Item>
            </Nav>
            <Form>
              <Tab.Content>
                <Tab.Pane eventKey="Description" style={{ color: "white" }}>
                  <DescriptionTab handleInputChange={handleInputChange} />
                </Tab.Pane>
                <Tab.Pane eventKey="Code">
                  <CodeTab formData={formData} DefaultSolutionCode={DefaultSolutionCode} DefaultRandomTestCode={DefaultRandomTestCode} handleInputChange={handleInputChange} />
                </Tab.Pane>
                <Tab.Pane eventKey="TestCases">
                  <TestcasesTab handleInputChange={handleInputChange} />
                </Tab.Pane>
                <Tab.Pane eventKey="Preview">
                  <PreviewTab formData={formData} FormMetaData={FormMetaData} />
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