import React from "react";
import { Tab, Nav, Form } from "react-bootstrap";
import { useState } from "react";
import OverviewTab from "./Tabs/OverviewTab";
import TargetStudentsTab from "./Tabs/TargetStudentsTab";
import QuestionsTab from "./Tabs/QuestionsTab";
import { toast } from "react-toastify";
import { postData } from "../../../Scripts/Axios";

// Main component
function CreateAssignmentNavtabs({ activeTab, Batches, MyQuestions, OtherQuestions }) {
    const [formData, setFormData] = useState({
        AssignmentName: "",
        DueTimestamp: "",
        Year: "",
        Batches: [],
        Questions: [],
        AIAssistance: false
    });
    console.log(formData);
    const handleSubmit = async () => {
        console.log(formData);
        await postData("/professors/createAssignment", formData, "Error while creating assignment", () => {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
    };

    return (
        <Tab.Container defaultActiveKey={activeTab}>
            <Nav variant="tabs" defaultActiveKey={activeTab} fill>
                <Nav.Item>
                    <Nav.Link eventKey="OverviewTab">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="TargetStudents">Target Students</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="Questions">Questions</Nav.Link>
                </Nav.Item>
            </Nav>
            <Form>
                <Tab.Content>
                    <OverviewTab formData={formData} setFormData={setFormData} />
                    <TargetStudentsTab formData={formData} setFormData={setFormData} Batches={Batches} />
                    <Tab.Pane eventKey="Questions">
                        <QuestionsTab setFormData={setFormData} MyQuestions={MyQuestions} OtherQuestions={OtherQuestions} handleSubmit={handleSubmit} />
                    </Tab.Pane>
                </Tab.Content>
            </Form>
        </Tab.Container>
    );
}

export default CreateAssignmentNavtabs;


