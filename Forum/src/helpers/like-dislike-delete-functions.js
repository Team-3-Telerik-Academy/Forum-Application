import { deletePost, dislikePost, likePost } from "../services/posts.service";

export const handleLikePost = (postId, userData, fn, fnArg) => {
    likePost(userData.username, postId).then(() =>
        fn(!fnArg)
    );
};

export const handleDislikePost = (postId, userData, fn, fnArg) => {
    dislikePost(userData.username, postId).then(() =>
        fn(!fnArg)
    );
};

export const handleDeletePost = (postId, userData, fn, fnArg) => {
    deletePost(postId, userData.username).then(() =>
        fn(!fnArg)
    );
};