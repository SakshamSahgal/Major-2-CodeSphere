import React, { useState, useEffect } from 'react';
import { Tab, Nav, Spinner } from 'react-bootstrap';
import { fetchAPI } from "../../Scripts/Axios"
import { toast } from 'react-toastify';
import { Typewriter } from 'react-simple-typewriter'

function AIAssistanceTabs({ activeTab = "Improvement", tabs = [], AIResponses = {} }) {
    console.log("AIResponses", AIResponses);
    return (
        <>
            <Tab.Container defaultActiveKey={activeTab}>
                <Nav variant="tabs" defaultActiveKey={activeTab} fill>
                    {tabs.map((tab, index) => (
                        <Nav.Item key={index}>
                            <Nav.Link eventKey={tab}>{tab}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
                <Tab.Content>
                    {tabs.map((tab, index) => (
                        <Tab.Pane key={index} eventKey={tab}>
                            {AIResponses[tab] === null ? ( // Check if AIResponse for this tab is null
                                <div className="d-flex justify-content-center">
                                    <div className="container text-center">
                                        <div className="row my-3 py-3">
                                            <div className="col">
                                                <div className="d-flex justify-content-center">
                                                    <Spinner animation="border" role="status" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center">
                                    <div className="container text-center">
                                        <div className="row my-3 py-3">
                                            <div className="col">
                                                <Typewriter
                                                    words={[AIResponses[tab]]}
                                                    loop={1}
                                                    cursor
                                                    cursorStyle='|'
                                                    typeSpeed={30}
                                                    delaySpeed={1000}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>
        </>
    );
}

export default AIAssistanceTabs;
