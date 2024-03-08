import Skeleton from "react-loading-skeleton"; // Import the skeleton component
import 'react-loading-skeleton/dist/skeleton.css'
import { ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function QuestionListSkeleton({ count }) {
    // Create an array with count elements to map over
    const skeletonArray = Array.from({ length: count }, (_, index) => index);

    return (
        <>
            <hr />
            <ListGroup>
                {skeletonArray.map((index) => (
                    <ListGroup.Item action key={index} className="d-flex justify-content-between align-items-center mb-2">
                        <Skeleton width={200} />
                        <FontAwesomeIcon icon={faEye} className='mx-1' />
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <hr />

        </>
    );
}

export default QuestionListSkeleton;