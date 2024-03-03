import React from 'react';

function VerdictBadge({ verdict }) {
    const verdictMap = {
        'Accepted': { variant: 'success', text: 'AC' },
        'Wrong Answer': { variant: 'danger', text: 'WA' },
        'Time Limit Exceeded': { variant: 'warning', text: 'TLE' },
        'Runtime Error': { variant: 'danger', text: 'RE' },
        'Compilation Error': { variant: 'danger', text: 'CE' },
        'Memory Limit Exceeded': { variant: 'warning', text: 'MLE' },
    };

    const { variant = 'secondary', text = verdict } = verdictMap[verdict] || {};

    return (
        <span className={`badge  bg-${variant}`} style={{ fontSize: '17px' }}>{text}</span>
    );
}

export default VerdictBadge;
