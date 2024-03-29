
import { ListGroup } from 'react-bootstrap';
import { convertIsoToNormalTime } from '../../Scripts/TimeFunctions';

//if LoginType is 'Students', then onclick of any submission will not redirect to analyzeSubmission page
function SubmissionsList({ submissions, LoginType }) {

    if (submissions === null) return <p>Loading...</p>;
    else if (submissions.length === 0) return <p>No Submissions Yet</p>;
    else {
        return (
            <ListGroup>
                {submissions.map((submission, index) => (
                    <ListGroup.Item
                        action
                        key={index}
                        className="d-flex justify-content-between align-items-center mb-2 rounded"
                        onClick={() => {
                            if (LoginType === "professors") {
                                window.location.href = `/analyzeSubmission/${submission._id}`;
                            }
                        }}
                    >
                        <a className='small'>{submission.Student.Name}</a>
                        <div className="d-flex justify-content-end align-items-center">
                            <div className='px-1 small'>{submission.ScoreObtained}/{submission.TotalScore}</div>
                            <div className='px-1 small'>{convertIsoToNormalTime(submission.SubmittedOn).date}</div>
                            <div className='px-1 small'>{convertIsoToNormalTime(submission.SubmittedOn).time}</div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        )
    }
}

export default SubmissionsList;