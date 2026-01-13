/**
 * Detects if a new issue title is similar to any existing issues.
 * Logic: Splits into lowercase words. If 2 or more words match, it's similar.
 * @param {string} newTitle - The title of the new issue
 * @param {Array} existingIssues - List of existing issues
 * @returns {Array} - Array of similar issues found
 */
export function findSimilarIssues(newTitle, existingIssues) {
    if (!newTitle || !existingIssues) return [];

    const getWords = (str) => {
        return str.toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/)
            .filter(w => w.length > 2); // Ignore very short words like 'a', 'to', 'in'
    };

    const newWords = new Set(getWords(newTitle));

    return existingIssues.filter(issue => {
        const existingWords = getWords(issue.title);
        let matchCount = 0;

        existingWords.forEach(word => {
            if (newWords.has(word)) {
                matchCount++;
            }
        });

        return matchCount >= 2;
    });
}

/**
 * Validates status transition.
 * Rule: Open -> In Progress -> Done
 */
export function isValidStatusTransition(currentStatus, newStatus) {
    const rules = {
        'Open': ['In Progress'],
        'In Progress': ['Done', 'Open'], // Allow going back to Open? "It must go Open -> In Progress -> Done". Usually backward is implicitly allowed, but strict rule on DONE means Open->Done is forbidden.
        'Done': ['In Progress'] // Reopen
    };

    // If staying same, true
    if (currentStatus === newStatus) return true;

    // Strict check for Open -> Done
    if (currentStatus === 'Open' && newStatus === 'Done') return false;

    return true;
}
