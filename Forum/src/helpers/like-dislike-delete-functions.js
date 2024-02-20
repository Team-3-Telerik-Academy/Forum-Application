import { deletePost, dislikePost, likePost } from "../services/posts.service";

/**
 * Handles liking a post.
 * 
 * @param {string} postId - The ID of the post to be liked.
 * @param {object} userData - The user data containing the username.
 * @param {function} fn - The function to be called after liking the post.
 * @param {boolean} fnArg - The argument to be passed to the function.
 * @returns {void}
 */
export const handleLikePost = (postId, userData, fn, fnArg) => {
    likePost(userData.username, postId).then(() =>
        fn(!fnArg)
    );
};

/**
 * Handles disliking a post.
 * 
 * @param {string} postId - The ID of the post to dislike.
 * @param {object} userData - The user data.
 * @param {function} fn - The function to call after disliking the post.
 * @param {boolean} fnArg - The argument to pass to the function.
 * @returns {void}
 */
export const handleDislikePost = (postId, userData, fn, fnArg) => {
    dislikePost(userData.username, postId).then(() =>
        fn(!fnArg)
    );
};

/**
 * Handles the deletion of a post.
 * 
 * @param {string} postId - The ID of the post to be deleted.
 * @param {object} userData - The user data containing the username.
 * @param {function} fn - The callback function to be executed after the post is deleted.
 * @param {boolean} fnArg - The argument to be passed to the callback function.
 */
export const handleDeletePost = (postId, userData, fn, fnArg) => {
    deletePost(postId, userData.username).then(() =>
        fn(!fnArg)
    );
};