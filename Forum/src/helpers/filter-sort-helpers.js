export const setValue = fn => (e) => {
    fn(e.target.value);
};

export const searchPostBy = (value, selectSearch, fn, array) => {
    return fn(
        array?.filter((user) => user[selectSearch]?.toLowerCase().includes(value))
    );
};

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