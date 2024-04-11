
import { useState, useEffect } from 'react';
import { countLines, countComments, cyclomaticComplexity, countIndents, countLoops, countIdentifiers } from '../../Scripts/CPPScoreCalculator.js';

function CodeScore({ Code }) {
    const [score, setScore] = useState(null);

    //called during component Mount and on every change in the Code
    useEffect(() => {
        const CalculateScore = () => {
            console.log("Lines", countLines(Code));
            console.log("Comments", countComments(Code));
            console.log("Cyclometric Complexity :", cyclomaticComplexity(Code));
            console.log("Indents", countIndents(Code));
            console.log("Loops", countLoops(Code));
            console.log("Identifiers", countIdentifiers(Code));
            setScore({
                lines: countLines(Code),
                comments: countComments(Code),
                cyclometricComplexity: cyclomaticComplexity(Code),
                indents: countIndents(Code),
                loops: countLoops(Code),
                identifiers: countIdentifiers(Code)
            })
        };
        CalculateScore();
    }, [Code]);

    return (
        <div className='container'>
            {/* display a sleek palet with all values */}
            {score && <div className="row bg-dark bg-opacity-75 rounded-3" style={{ color: "white" }}>
                <div className="col-4">
                    <div className="row">
                        <div className="col-12">
                            <span>Lines : {score.lines}</span>
                        </div>
                        <div className="col-12">
                            <span>Comments : {score.comments}</span>
                        </div>
                        <div className="col-12">
                            <span>Indents : {score.indents}</span>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="row">
                        <div className="col-12">
                            <span>Cyclometric Complexity : {score.cyclometricComplexity}</span>
                        </div>
                        <div className="col-12">
                            <span>Loops : {score.loops}</span>
                        </div>
                        <div className="col-12">
                            <span>Identifiers : {score.identifiers}</span>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default CodeScore;
