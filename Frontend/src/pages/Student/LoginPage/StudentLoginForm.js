
function StudentLoginForm({ handleSubmit, handleInputChange, Institutions }) {
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="Institution" className="form-label">Institution</label>
                <select className="form-select" id="Institution" onChange={handleInputChange}>
                    <option>Select Institution</option>
                    {Institutions.length && (Institutions.map((Institution) => (
                        <option key={Institution._id} value={Institution.Name}>{Institution.Name}</option>
                    )))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="Username" className="form-label">Username</label>
                <input type="text" className="form-control" id="Username" placeholder="Enter Username" onChange={handleInputChange} autoComplete="Username" />
            </div>
            <div className="mb-3">
                <label htmlFor="Password" className="form-label">Password</label>
                <input type="Password" className="form-control" id="Password" placeholder="Enter Password" autoComplete="current-Password" onChange={handleInputChange} />
            </div>
            <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
    );
};

export default StudentLoginForm;