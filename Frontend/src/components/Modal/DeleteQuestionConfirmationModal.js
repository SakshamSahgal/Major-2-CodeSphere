import React from "react";
import { Modal, Button } from "react-bootstrap";


function DeleteQuestionConfirmationModal({ show, handleClose, handleDelete, Label, includedInAssignmentsArray = [] }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure you want to delete <b>{Label}</b>?</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {/* iterate over the assignment array and use ListGroup */}

        {includedInAssignmentsArray.length > 0 && (
          <div>
            <p>{Label} is included in the following assignments:</p>
            <ul>
              {includedInAssignmentsArray.map((assignment, index) => (
                <li key={index}>{assignment.AssignmentName}</li>
              ))}
            </ul>
            <p>Delete these Assignments before deleting <b>{Label}</b></p>
          </div>
        )}

      </Modal.Body>
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

export default DeleteQuestionConfirmationModal;