import { useState, useEffect } from 'react';

function CharacterCounter({ maxLength, textAreaRef }) {
    const [remainingChars, setRemainingChars] = useState(maxLength);

    useEffect(() => {
        const handleInput = () => {
            const inputText = textAreaRef.current.value;
            setRemainingChars(maxLength - inputText.length);
        };

        textAreaRef.current.addEventListener('input', handleInput);

    }, [maxLength, textAreaRef]);

    return (
        <div>
            {remainingChars >= 0 ? (
                <p className='text-muted'>  {remainingChars} characters remaining</p>
            ) : (
                <p style={{ color: 'red' }}>{Math.abs(remainingChars)} characters over limit</p>
            )}
        </div>
    );
}

export default CharacterCounter;
