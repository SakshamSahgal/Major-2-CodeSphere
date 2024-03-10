import Spinner from 'react-bootstrap/Spinner';

function LoadingSpinner() {
    return (
        <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 9999 }}>
            <div className="d-flex justify-content-center align-items-center w-100 h-100">
                <Spinner className="text-white" animation="border" style={{ width: '5rem', height: '5rem' }} />
            </div>
        </div>
    );
}

export default LoadingSpinner;