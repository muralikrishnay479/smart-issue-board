/**
 * Detects if a new issue title is similar to any existing issues to prevent duplicates.
 * Algorithm: Tokenizes title into matching lowercase words.
 * 
 * @param {string} newTitle - The title of the new issue.
 * @param {Array} existingIssues - List of all existing issues to check against.
 * @returns {Array} - Array of potential duplicate issues found (matching >= 2 words).
 */
export function findSimilarIssues(newTitle, existingIssues) {
    if (!newTitle || !existingIssues) return [];

    const getWords = (str) => {
        return str.toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/)
            .filter(w => w.length > 2); // Ignore very short words
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
 * Validates if an issue status transition is allowed based on business rules.
 * Workflow: Open -> In Progress -> Done.
 * 
 * @param {string} currentStatus - The current status of the issue.
 * @param {string} newStatus - The target status.
 * @returns {boolean} True if the transition is allowed, false otherwise.
 */
export function isValidStatusTransition(currentStatus, newStatus) {
    // If staying same, true
    if (currentStatus === newStatus) return true;

    // Strict check for Open -> Done (Must go through In Progress)
    if (currentStatus === 'Open' && newStatus === 'Done') return false;

    // All other transitions implicitly allowed (including moving backwards)
    return true;
}
