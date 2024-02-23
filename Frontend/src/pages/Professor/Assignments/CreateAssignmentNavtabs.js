import React from "react";
import { Tab, Nav, Form } from "react-bootstrap";
import { useState } from "react";
import OverviewTab from "./Tabs/OverviewTab";
import TargetStudentsTab from "./Tabs/TargetStudentsTab";
import QuestionsTab from "./Tabs/QuestionsTab";
import axios from "axios";
import { toast } from "react-toastify";

// Main component
function CreateAssignmentNavtabs({ activeTab, Batches, MyQuestions, OtherQuestions }) {
    const [formData, setFormData] = useState({
        AssignmentName: "",
        DueTimestamp: "",
        Year: "",
        Batches: [],
        Questions: [],
    });

    const handleSubmit = async () => {
        console.log(formData);
        try {
            const response = await axios.post("/professors/createAssignment", formData, { withCredentials: true });
            console.log(response.data);
            if (response.data.success)
            {
                toast.success(response.data.message);
                // reload after 1 sec
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            else
                toast.error(response.data.message);
        }
        catch (err) {
            toast.error(`error while creating assignment, error: ${err.message}`);
        }
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
                    <QuestionsTab setFormData={setFormData} MyQuestions={MyQuestions} OtherQuestions={OtherQuestions} handleSubmit={handleSubmit} />
                </Tab.Content>
            </Form>
        </Tab.Container>
    );
}

export default CreateAssignmentNavtabs;


