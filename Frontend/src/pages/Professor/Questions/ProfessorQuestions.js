import React, { useEffect } from 'react';
import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import { Tab, Nav } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function ProfessorQuestions() {

    const [MyQuestions, setMyQuestions] = useState([]);
    const [OtherQuestions, setOtherQuestions] = useState([]);

    useEffect(() => {
        const fetchMyQuestions = async () => {
            try {
                const response = await axios(`/professors/getMyQuestions`, { withCredentials: true });
                if (response.data.success) {
                    console.log(response.data.Questions);
                    setMyQuestions(response.data.Questions);
                }
                else {
                    toast.error(response.data.message);
                }
            }
            catch (err) {
                toast.error(`error while fetching MyQuestions, error ${err.message}`);
            }
        }

        const fetchOtherQuestions = async () => {
            try {
                const response = await axios(`/professors/getOtherQuestions`, { withCredentials: true });
                if (response.data.success) {
                    console.log(response.data.Questions);
                    setOtherQuestions(response.data.Questions);
                }
                else {
                    toast.error(response.data.message);
                }
            }
            catch (err) {
                toast.error(`error while fetching OtherQuestions, error ${err.message}`);
            }
        }

        fetchMyQuestions();
        fetchOtherQuestions();

    }, []);

    return (
        <>
            <NavbarWithProfileAndSidebar TabNames={["Assignments", "Evaluations", "AddQuestion", "Questions"]} TabLinks={["/professors/assignments", "/professors/evaluations", "/professors/addQuestion", "/professors/questions"]} LoginType={"Professors"} ActiveTabIndex={3} />
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
                                    <hr />
                                    <ListGroup>
                                        {MyQuestions.map((question, index) => {
                                            return (
                                                <ListGroup.Item action key={index} className="d-flex justify-content-between align-items-center mb-2">
                                                    {question.QuestionName}
                                                    <FontAwesomeIcon icon={faEye} className='mx-1' />
                                                </ListGroup.Item>
                                            );
                                        })}
                                    </ListGroup>
                                    <hr />
                                </Tab.Pane>
                                <Tab.Pane eventKey="OtherQuestions">
                                    <hr />
                                    <ListGroup>
                                        {OtherQuestions.map((question, index) => {
                                            return (
                                                <ListGroup.Item action key={index} className="d-flex justify-content-between align-items-center mb-2">
                                                    {question.QuestionName}
                                                    <FontAwesomeIcon icon={faEye} className='mx-1' />
                                                </ListGroup.Item>
                                            );
                                        })}
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
