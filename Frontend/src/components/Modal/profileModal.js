import axios from "axios";
import React from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

function ProfileModal({ show, onHide }) {

    const Logout = async () => {


        localStorage.removeItem('StudentsLogin');
        localStorage.removeItem('ProfessorsLogin');

        const response = await axios.delete('/logout', { withCredentials: true });
        console.log(response.data);
        if(response.data.success === false)
            toast.error(response.data.message);
        else
        {
            toast.success(response.data.message);
            window.location.href = '/';
        }

    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Profile Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>This is the content of your profile modal.</p>
            </Modal.Body>
            <Modal.Footer>
                {/* add a logout button in center*/}
                <Button variant="danger" className="w-100" onClick={Logout}>Logout</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProfileModal;