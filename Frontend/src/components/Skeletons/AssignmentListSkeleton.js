import Skeleton from "react-loading-skeleton"; // Import the skeleton component
import 'react-loading-skeleton/dist/skeleton.css'


function AssignmentListSkeleton({ count }) {
    // Create an array with count elements to map over
    const skeletonArray = Array.from({ length: count }, (_, index) => index);

    return (
        <div>
            {skeletonArray.map((index) => (
                <div key={index} className="row my-3 w-100">
                    <div className="col">
                        <div className="card">
                            <div className="card-header d-flex align-items-center">
                                <small className="text-muted">Posted By: <Skeleton width={50} /></small>
                                <h5 className="text-center mb-0 flex-grow-1"><Skeleton width={50} /></h5>
                            </div>
                            <div className="card-body">
                                <div>
                                    <p className="card-text">
                                        <strong>Posted On:</strong>{" "}
                                        <Skeleton width={150} />{" "}
                                    </p>
                                    <p className="card-text">
                                        <strong>Due Timestamp:</strong>{" "}
                                        <Skeleton width={50} />{" "}
                                    </p>
                                    <p className="card-text">
                                        <strong>Batches:</strong>{" "}
                                        <Skeleton width={50} />
                                    </p>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-between">
                                <button className="btn btn-primary btn-sm d-block d-sm-inline-block"> Questions </button>
                                <button className="btn btn-primary btn-sm d-block d-sm-inline-block"> Submissions </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AssignmentListSkeleton;