
import LandingPageNavbar from "../../components/Navbar/LandingPageNavbar";
import LandingPageCard from "../../components/Card/LandingPageCard";
import LandingPageFooter from "../../components/Footer/LandingPageFooter";
function LandingPage() {
  return (
    <>
      <LandingPageNavbar />
      <div className="container">
        <div className="row my-3 align-items-center">
          <div className="col-6 d-none d-md-block">
            <h1 className="display-3 " style={{ color: '#fff' }}>Welcome to CodeSphere</h1>
            <p className="lead" style={{ color: '#fff' }}>CodeSphere is a platform for students and professors to simplify the process of coding assignments.</p>
          </div>
          <div className="col-12 col-md-6">
            <img src="/assets/images/LOGO.png" alt="" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 my-3">
            <LandingPageCard title="CodeSphere for Students" content="Coding made simple with CodeSphere." btntext="Login" btnlink="/studentlogin" />
          </div>
          <div className="col-12 col-md-6 my-3">
            <LandingPageCard title="CodeSphere for Professors" content="Streamlining grading with CodeSphere." btntext="Login" btnlink="/professorlogin" />
          </div>
        </div>
        <div className="row my-3">
          <div className="col-12">
            <LandingPageCard title="Register Your College" content="Join the CodeSphere community today." btntext="Register" btnlink="/registercollege" />
          </div>
        </div>
      </div>
      <LandingPageFooter />
    </>
  );
}

export default LandingPage;