/**
 * Sets the value of a function based on the target value of an event.
 * @param {Function} fn - The function to be called with the new value.
 * @returns {Function} - A function that takes an event and calls the provided function with the target value.
 */
export const setValue = fn => (e) => {
    fn(e.target.value);
};

/**
 * Searches for posts in an array based on a specific value and property.
 *
 * @param {string} value - The value to search for.
 * @param {string} selectSearch - The property to search in each object of the array.
 * @param {Function} fn - The function to apply on the filtered array.
 * @param {Array} array - The array of objects to search in.
 * @returns {*} - The result of applying the function on the filtered array.
 */
export const searchPostBy = (value, selectSearch, fn, array) => {
    return fn(
        array?.filter((user) => user[selectSearch]?.toLowerCase().includes(value))
    );
};

/**
 * Sorts an array of posts based on the given selector.
 *
 * @param {string} selector - The sorting selector.
 * @returns {Function|null} - The sorting function or null if the selector is invalid.
 */
export const sortPosts = (selector) => {
    switch (selector) {
        case "title":
            return (a, b) => a.title.localeCompare(b.title);
        case "title-ZA":
            return (a, b) => b.title.localeCompare(a.title);
        case "oldest":
            return (a, b) => a.createdOn - b.createdOn;
        case "newest":
            return (a, b) => b.createdOn - a.createdOn;
        default:
            return null;
    }
};