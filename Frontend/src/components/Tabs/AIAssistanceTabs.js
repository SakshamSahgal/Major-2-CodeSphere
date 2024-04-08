import React, { useState, useEffect } from 'react';
import { Tab, Nav, Spinner } from 'react-bootstrap';
import { fetchAPI } from "../../Scripts/Axios"
import { toast } from 'react-toastify';

function AIAssistanceTabs({ activeTab = "Improvement" }) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState(null);
    const [aIResponse, setAIResponse] = useState("");


    const handleTabChange = (tab) => {
        if (tab === currentTab) {
            return; // Return early if clicked tab is already active
        }
        console.log(`Tab changed to ${tab}`);
        setCurrentTab(tab);
        setIsLoading(true);
        fetchAIResponse(tab);
    }

    const fetchAIResponse = async (tab) => {
        try {
            console.log(`fetching AI response for ${tab} tab`);
            console.log(`/Get${tab}AIAssistance`)
            const response = await fetchAPI(`/Get${tab}AIAssistance`);
            console.log(response.data);
            if (response.data.success) {
                toast.success(response.data.message);
                setAIResponse(response.data.response);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        handleTabChange(activeTab);
    }, [activeTab]);


    return (
        <Tab.Container defaultActiveKey={activeTab}>
            <Nav variant="tabs" defaultActiveKey={activeTab} fill onSelect={handleTabChange}>
                <Nav.Item>
                    <Nav.Link eventKey="Improvement">Improvement</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="AltApproaches">Alt-Approaches</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="Error">Errors</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="Improvement">
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" style={{ width: '3rem', height: '3rem' }} />
                        </div>
                    ) : (
                        <>
                            <p>{aIResponse}</p>
                        </>
                    )}
                </Tab.Pane>
                <Tab.Pane eventKey="AltApproaches">
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" style={{ width: '3rem', height: '3rem' }} />
                        </div>
                    ) : (
                        <>
                            <p>{aIResponse}</p>
                        </>
                    )}
                </Tab.Pane>
                <Tab.Pane eventKey="Error">
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" style={{ width: '3rem', height: '3rem' }} />
                        </div>
                    ) : (
                        <>
                            <p>{aIResponse}</p>
                        </>
                    )}
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    );
}

export default AIAssistanceTabs;
