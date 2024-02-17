function RegisterCollegeForm({ handleSubmit, handleInputChange }) {
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="CollegeName" className="form-label">College Name</label>
                <input type="text" className="form-control" id="CollegeName" placeholder="Enter College Name" onChange={handleInputChange} autoComplete="CollegeName" />
            </div>
            <div className="mb-3">
                <label htmlFor="Name" className="form-label">Your Name</label>
                <input type="text" className="form-control" id="Name" placeholder="Enter Your Name" autoComplete="current-Name" onChange={handleInputChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="Email" className="form-label">Email</label>
                <input type="email" className="form-control" id="Email" placeholder="Enter Email" onChange={handleInputChange} autoComplete="email" />
            </div>
            <div className="mb-3">
                <label htmlFor="PhoneNo" className="form-label">Phone Number</label>
                <input type="tel" className="form-control" id="PhoneNo" placeholder="Enter Phone Number" onChange={handleInputChange} autoComplete="tel" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default RegisterCollegeForm;
