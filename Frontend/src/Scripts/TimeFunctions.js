function getTimeElapsed(isoTimeString) {
    const isoTime = new Date(isoTimeString);
    const currentTime = new Date();

    let elapsedMilliseconds = currentTime - isoTime;

    if (elapsedMilliseconds === 0) return "Just Now";

    let EndingString = (elapsedMilliseconds > 0) ? " ago" : " from now";
    elapsedMilliseconds = Math.abs(elapsedMilliseconds);

    const seconds = Math.floor(elapsedMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} ${EndingString}`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${EndingString}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ${EndingString}`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ${EndingString}`;
    }
}

function convertIsoToNormalTime(isoTimeString) {
    const isoTime = new Date(isoTimeString);

    const dateOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };

    const formattedDate = isoTime.toLocaleString(undefined, dateOptions);
    const formattedTime = isoTime.toLocaleString(undefined, timeOptions);

    return {
        date: formattedDate,
        time: formattedTime,
    };
}

module.exports = { getTimeElapsed, convertIsoToNormalTime };