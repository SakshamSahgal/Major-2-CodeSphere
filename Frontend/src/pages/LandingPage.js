
function LandingPage() {
  return (
    <div>
      {/* add a button to link to profesor login page */}
        <a href="/professorlogin">Professor Login</a> <br />
        {/* add a button to link to student login page */}
        <a href="/studentlogin">Student Login</a>
        {/*  */} <br />
        <a href="/registercollege">Register College</a>
    </div>
  );
}

export default LandingPage;