import React from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";

function ProfileModal({ show, onHide }) {
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
                <Button variant="danger" className="w-100" onClick={onHide}>Logout</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProfileModal;