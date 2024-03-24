import { useParams } from 'react-router-dom';

function Submissions() {
    
    const { _id } = useParams();

    return (
        <div>
            <h1>Submissions</h1>
            <h2>Assignment ID: {_id}</h2>
        </div>
    );
}

export default Submissions;