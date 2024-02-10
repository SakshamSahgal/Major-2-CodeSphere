import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';


function PlainNavbar() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid className="px-1">
                <Navbar.Brand href="/">CodeSphere</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default PlainNavbar;
