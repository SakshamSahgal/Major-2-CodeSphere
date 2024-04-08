import { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import AIAssistanceTabs from '../Tabs/AIAssistanceTabs';
import { useEffect } from 'react';
import { fetchAPI } from '../../Scripts/Axios';
import { toast } from 'react-toastify';
function AIAssistanceModal() {

    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
        fetchAIResponse("Improvement");
        fetchAIResponse("AltApproaches");
        fetchAIResponse("Error");
    }
    const [AIResponses, setAIResponses] = useState({
        Improvement: null,
        AltApproaches: null,
        Error: null
    });

    const handleClose = () => {
        setShow(false);
        // Reset the AIResponses to null
        setAIResponses({
            Improvement: null,
            AltApproaches: null,
            Error: null
        });
    }

    const tabs = ["Improvement", "AltApproaches", "Error"];

    const fetchAIResponse = async (tab) => {
        try {
            console.log(`fetching AI response for ${tab} tab`);
            console.log(`/Get${tab}AIAssistance`)
            const response = await fetchAPI(`/Get${tab}AIAssistance`);
            if (response.data.success) {
                setAIResponses(prevState => ({
                    ...prevState,
                    [tab]: response.data.response
                }));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {
                <>
                    <Button variant="primary" onClick={handleShow} className='w-100'>
                        <FontAwesomeIcon icon={faMicrochip} style={{ cursor: 'pointer', color: 'white' }} /> AI Help
                    </Button>

                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title> AI Help </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <AIAssistanceTabs activeTab={"Improvement"} tabs={tabs} AIResponses={AIResponses} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose} >
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            }
        </>
    );
}

export default AIAssistanceModal;