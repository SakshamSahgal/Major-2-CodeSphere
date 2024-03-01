import React from 'react';

function VerdictBadge({ verdict }) {
    const verdictMap = {
        'Accepted': { variant: 'success', text: 'Accepted' },
        'Wrong Answer': { variant: 'danger', text: 'Wrong Answer' },
        'Time Limit Exceeded': { variant: 'warning', text: 'Time Limit Exceeded' },
        'Runtime Error': { variant: 'danger', text: 'Runtime Error' },
        'Compilation Error': { variant: 'danger', text: 'Compilation Error' }
    };

    const { variant = 'secondary', text = verdict } = verdictMap[verdict] || {};

    return (
        <span className={`badge  bg-${variant}`} style={{ fontSize: '17px' }}>{text}</span>
    );
}

export default VerdictBadge;
