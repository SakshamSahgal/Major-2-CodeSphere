import { Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ListGroup } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';

function LogsAccordion({ results, isOpen, setIsOpen }) {

    return (
        <Accordion flush activeKey={isOpen ? '0' : null} onClick={() => setIsOpen(!isOpen)}>
            <Accordion.Item eventKey="0">
                <Accordion.Header className="text-center my-3" style={{ cursor: 'pointer' }}>
                    <h4>Logs</h4>
                </Accordion.Header>

                <Accordion.Body>
                    <ListGroup>
                        {results.map((result, idx) => (
                            <ListGroup.Item key={idx} className="d-flex justify-content-betweenr">
                                <span className='mx-1'>{result.success ? (
                                    <FontAwesomeIcon icon={faForward} style={{ color: 'green' }} />
                                ) : (
                                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />
                                )}</span>
                                <span>{result.message}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default LogsAccordion;