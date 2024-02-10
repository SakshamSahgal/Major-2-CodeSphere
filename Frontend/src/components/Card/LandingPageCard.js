import React from 'react';

function LandingPageCard({ title, content, btntext, btnlink }) {
    return (
        <div className="card" style={{ backgroundColor: 'rgb(227,243,246)' }}>
            <div className="card-body text-center">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{content}</p>
                <a href={btnlink} className="btn btn-primary">{btntext}</a>
            </div>
        </div>
    );
}

export default LandingPageCard;
