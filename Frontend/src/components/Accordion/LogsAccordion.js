import { Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ListGroup } from 'react-bootstrap';


function LogsAccordion({ results, isOpen, setIsOpen }) {

    // Group results by phase, acc is the accumulator, curr is the current value
    const groupedResults = results.reduce((acc, curr) => {
        acc[curr.phase] = acc[curr.phase] || [];
        acc[curr.phase].push(curr);
        return acc;
    }, {});
    return (
        <Accordion flush activeKey={isOpen ? '0' : null} onClick={() => setIsOpen(!isOpen)}>
            <Accordion.Item eventKey="0">
                <Accordion.Header className="text-center my-3" style={{ cursor: 'pointer' }}>
                    <h4>Logs</h4>
                </Accordion.Header>

                <Accordion.Body>
                    {Object.keys(groupedResults).map((phase, index) => (
                        <div key={index}>
                            <h3>{phase}</h3>
                            <ListGroup>
                                {groupedResults[phase].map((result, idx) => (
                                    (
                                        <ListGroup.Item key={idx} >
                                            {
                                                result.success ? (
                                                    <FontAwesomeIcon icon={faForward} style={{ color: 'green' }} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />
                                                )
                                            }
                                            {` ${result.message}`}
                                        </ListGroup.Item>
                                    )
                                ))}
                            </ListGroup>
                        </div>
                    ))
                    }
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default LogsAccordion;