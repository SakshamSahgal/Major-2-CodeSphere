import { useParams } from 'react-router-dom';


function SolveAssignment() {
    // Accessing the id parameter from the route
    const { _id } = useParams();
    console.log(_id);
    return (
        <div>
            return <div>Solving Assignment with ID: {_id}</div>;
        </div>
    );
}

export default SolveAssignment;
