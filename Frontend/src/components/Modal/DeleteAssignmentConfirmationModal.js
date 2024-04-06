import React from "react";
import { Modal, Button } from "react-bootstrap";


function DeleteAssignmentConfirmationModal({ show, handleClose, handleDelete, Label }) {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete <b>{Label}</b>?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteAssignmentConfirmationModal;