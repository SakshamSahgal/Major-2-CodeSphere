import axios from "axios";
import React from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

//LoginType = 'Students' or 'Professors'
function ProfileModal({ show, onHide, profileData, LoginType }) {
    //show is True or False
    //onHide is a function to close the modal

    const Logout = async () => {

        localStorage.removeItem(`${LoginType}Login`);

        const response = await axios.delete('/logout', { withCredentials: true }); //this will remove the cookie from the browser
        console.log(response.data);
        if (response.data.success === false)
            toast.error(response.data.message);
        else {
            toast.success(response.data.message);
            window.location.href = '/';
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* iterate over the contents of profiledata object */}
                <ul className="list-group text-center">
                    {Object.keys(profileData).map((key, index) => (
                        <li key={index} className="list-group-item">
                            <span className="fw-bold">{key}:</span> {profileData[key]}
                        </li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                {/* add a logout button in center*/}
                <Button variant="danger" className="w-100" onClick={Logout}>Logout</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProfileModal;