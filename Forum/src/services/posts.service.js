import {
  ref,
  push,
  get,
  query,
  equalTo,
  orderByChild,
  update,
  set,
  remove,
} from "firebase/database";
import { db } from "../config/firebase-config";
import { updateUserPosts } from "./users.service";

/**
 * Converts a Firebase snapshot of posts into an array of post objects.
 * @param {Object} snapshot - The Firebase snapshot containing the posts data.
 * @returns {Array} - An array of post objects.
 */
export const fromPostsDocument = (snapshot) => {
  try {
    const postsDocument = snapshot.val();

    if (!postsDocument) {
      throw new Error("Snapshot value is null or undefined");
    }

    return Object.keys(postsDocument).map((key) => {
      const post = postsDocument[key];

      if (!post) {
        throw new Error(`Post with key ${key} is null or undefined`);
      }

      return {
        ...post,
        id: key,
        createdOn: new Date(post.createdOn),
        likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
      };
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Converts a Firebase snapshot of comments into an array of comment objects.
 * @param {Object} snapshot - The Firebase snapshot of comments.
 * @returns {Array} - An array of comment objects.
 * @throws {Error} - If the snapshot value is null or undefined, or if a comment is null or undefined.
 */
export const fromCommentsDocument = (snapshot) => {
  try {
    const commentsDocument = snapshot.val();

    if (!commentsDocument) {
      throw new Error("Snapshot value is null or undefined");
    }

    return Object.keys(commentsDocument).map((key) => {
      const comment = commentsDocument[key];

      if (!comment) {
        throw new Error(`Comment with key ${key} is null or undefined`);
      }

      return {
        ...comment,
        id: key,
        createdOn: new Date(comment.createdOn),
        likedBy: comment.likedBy ? Object.keys(comment.likedBy) : [],
        dislikedBy: comment.dislikedBy ? Object.keys(comment.dislikedBy) : [],
      };
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Adds a new post to the database.
 * 
 * @param {string} title - The title of the post.
 * @param {string} content - The content of the post.
 * @param {string} category - The category of the post.
 * @param {string} username - The username of the author.
 * @returns {Promise<Object>} - A promise that resolves to the newly added post.
 * @throws {Error} - If an error occurs while adding the post.
 */
export const addPost = async (title, content, category, username) => {
  try {
    const result = await push(ref(db, "posts"), {
      title,
      content,
      category,
      author: username,
      createdOn: new Date().toString(),
      comments: {},
      likes: 0,
      likedBy: {},
      tags: {},
    });

    await updateUserPosts(username, result.key, title);
    return getPostById(result.key);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Edits a post with the specified postId, title, and content.
 * @param {string} postId - The ID of the post to edit.
 * @param {string} title - The new title for the post.
 * @param {string} content - The new content for the post.
 * @returns {Promise<void>} - A promise that resolves when the post is successfully edited.
 */
export const editPost = async (postId, title, content) => {
  try {
    const postToEdit = ref(db, `/posts/${postId}`);
    await update(postToEdit, { title: title, content: content });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Deletes a post from the admin panel.
 * 
 * @param {string} id - The ID of the post to delete.
 * @param {Array} posts - The array of posts.
 * @param {Function} setFn - The function to update the posts array.
 * @returns {Promise<void>} - A promise that resolves when the post is deleted.
 */
export const adminPanelDeletePost = async (id, posts, setFn) => {
  const postToDelete = ref(db, `/posts/${id}`);
  const author = await get(ref(db, `/posts/${id}/author`));
  const username = author.val();
  const authorPosts = ref(db, `users/${username}/posts/${id}`);
  setFn([...posts].filter((post) => post.id !== id));
  await remove(authorPosts);
  await remove(postToDelete);
};

/**
 * Deletes a post and its associated comments and likes.
 * @param {string} postId - The ID of the post to be deleted.
 * @param {string} username - The username of the user who owns the post.
 * @returns {Promise<void>} - A promise that resolves when the post and its associated data are successfully deleted.
 * @throws {Error} - If an error occurs during the deletion process.
 */
export const deletePost = async (postId, username) => {
  try {
    const postComments = await get(ref(db, `/posts/${postId}/comments`));
    if (postComments.exists()) {
      await Promise.all(
        Object.keys(postComments.val()).map((comment) => {
          deleteCommentPost(
            postId,
            comment,
            postComments.val()[comment].username
          );
        })
      );
    }
    const likedBy = await get(ref(db, `/posts/${postId}/likedBy`));
    if (likedBy.exists()) {
      await Promise.all(
        Object.keys(likedBy.val()).map((user) => dislikePost(user, postId))
      );
    }

    const postToDeleteInUser = ref(db, `/users/${username}/posts/${postId}`);
    const postToDelete = ref(db, `/posts/${postId}`);
    await remove(postToDeleteInUser);
    await remove(postToDelete);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Retrieves a post by its ID.
 * @param {string} id - The ID of the post to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the retrieved post object.
 * @throws {Error} - If the post with the specified ID does not exist.
 */
export const getPostById = async (id) => {
  try {
    const result = await get(ref(db, `posts/${id}`));

    if (!result.exists()) {
      throw new Error(`Post with id ${id} does not exist!`);
    }

    const post = result.val();
    post.id = id;
    post.createdOn = new Date(post.createdOn);
    if (!post.likedBy) post.likedBy = [];

    return post;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Retrieves the liked posts of a user.
 * @param {string} username - The username of the user.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of liked posts.
 * @throws {Error} - If the user does not exist.
 */
export const getLikedPosts = async (username) => {
  try {
    const snapshot = await get(ref(db, `users/${username}`));

    if (!snapshot.val()) {
      throw new Error(`User with username @${username} does not exist!`);
    }

    const user = snapshot.val();
    if (!user.likedPosts) return [];

    return Promise.all(
      Object.keys(user.likedPosts).map(async (key) => {
        try {
          const snapshot = await get(ref(db, `posts/${key}`));
          const post = snapshot.val();

          return {
            ...post,
            createdOn: new Date(post.createdOn),
            id: key,
            likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
          };
        } catch (error) {
          console.error(error);
        }
      })
    );
  } catch (error) {
    console.error(error);
  }
};

/**
 * Retrieves posts by author from the database.
 * @param {string} username - The username of the author.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 */
export const getPostsByAuthor = async (username) => {
  try {
    const snapshot = await get(
      query(ref(db, "posts"), orderByChild("author"), equalTo(username))
    );

    if (!snapshot.exists()) return [];

    return fromPostsDocument(snapshot);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Retrieves posts by category from the database.
 * @param {string} category - The category of the posts to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 */
export const getPostsByCategory = async (category) => {
  try {
    const snapshot = await get(
      query(
        ref(db, "posts"),
        orderByChild("category"),
        equalTo(category.toLowerCase())
      )
    );

    if (!snapshot.exists()) return [];

    return fromPostsDocument(snapshot);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Retrieves all posts from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of posts.
 */
export const getAllPosts = async () => {
  try {
    const snapshot = await get(ref(db, "posts"));

    if (!snapshot.exists()) {
      return [];
    }

    return fromPostsDocument(snapshot);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Retrieves the tags of a post from the database.
 * @param {string} id - The ID of the post.
 * @returns {Promise<Object<string>>} The tags of the post.
 * @throws {Error} If the post with the given ID does not exist.
 */
export const getTagsOfAPost = async (id) => {
  try {
    const result = await get(ref(db, `posts/${id}/tags`));

    if (!result.exists()) {
      throw new Error(`Post with id ${id} does not exist!`);
    }

    const tags = result.val();
    return tags;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Adds a tag to a post.
 * @param {string} postId - The ID of the post.
 * @param {string} tag - The tag to be added.
 * @returns {Promise<void>} - A promise that resolves when the tag is added successfully.
 */
export const addTagPost = async (
  postId,
  tag
) => {
  try {
    const tagsKey = push(ref(db, `/posts/${postId}/tags`));

    return set(tagsKey, tag);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Edits a tag post.
 * @param {string} postId - The ID of the post.
 * @param {string} tagId - The ID of the tag.
 * @param {string} content - The new content for the tag.
 * @returns {Promise<void>} - A promise that resolves when the tag post is edited successfully.
 */
export const editTagPost = async (postId, tagId, content) => {
  try {
    const tagToEdit = ref(db, `/posts/${postId}/tags/${tagId}`);
    await set(tagToEdit, content);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Deletes a tag from a post.
 * 
 * @param {string} postId - The ID of the post.
 * @param {string} tagId - The ID of the tag to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the tag is successfully deleted.
 * @throws {Error} - If an error occurs while deleting the tag.
 */
export const deleteTagPost = async (postId, tagId) => {
  try {
    const tagToDelete = ref(db, `/posts/${postId}/tags/${tagId}`);
    return remove(tagToDelete);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Adds a comment to a post.
 * 
 * @param {string} username - The username of the user adding the comment.
 * @param {string} postId - The ID of the post to add the comment to.
 * @param {string} comment - The content of the comment.
 * @param {string} firstName - The first name of the user adding the comment.
 * @param {string} lastName - The last name of the user adding the comment.
 * @returns {Promise} A promise that resolves when the comment is successfully added.
 * @throws {Error} If an error occurs while adding the comment.
 */
export const addCommentPost = async (
  username,
  postId,
  comment,
  firstName,
  lastName
) => {
  try {
    const commentKey = push(ref(db, `/posts/${postId}/comments`));
    const result = await get(ref(db, `/users/${username}/comments`));
    const newCommentCount = result.val() + 1;
    await update(ref(db, `/users/${username}`), { comments: newCommentCount });

    return set(commentKey, {
      username: username,
      firstName: firstName,
      lastName: lastName,
      content: comment,
      createdOn: new Date().toString(),
      likes: 0,
      dislikes: 0,
      likedBy: {},
      dislikedBy: {},
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Edits a comment post.
 * 
 * @param {string} postId - The ID of the post.
 * @param {string} commentId - The ID of the comment.
 * @param {string} content - The new content of the comment.
 * @returns {Promise<void>} - A promise that resolves when the comment post is edited successfully.
 */
export const editCommentPost = async (postId, commentId, content) => {
  try {
    const commentToEdit = ref(db, `/posts/${postId}/comments/${commentId}`);
    await update(commentToEdit, { content: content });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Deletes a comment post.
 * 
 * @param {string} postId - The ID of the post.
 * @param {string} commentId - The ID of the comment.
 * @param {string} username - The username of the user.
 * @returns {Promise<void>} - A promise that resolves when the comment post is deleted.
 * @throws {Error} - If an error occurs during the deletion process.
 */
export const deleteCommentPost = async (postId, commentId, username) => {
  try {
    const commentToDelete = ref(db, `/posts/${postId}/comments/${commentId}`);
    const result = await get(ref(db, `/users/${username}/comments`));
    await update(ref(db, `/users/${username}`), { comments: result.val() - 1 });
    const commentsToDeleteInUser = ref(db, `/users/${username}/allComments/${commentId}`);
    await remove(commentsToDeleteInUser);
    return remove(commentToDelete);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Retrieves the comments of a post from the database.
 * @param {string} id - The ID of the post.
 * @returns {Promise<Object>} - A promise that resolves to the comments of the post.
 * @throws {Error} - If the post with the given ID does not exist.
 */
export const getCommentsOfAPost = async (id) => {
  try {
    const result = await get(ref(db, `posts/${id}/comments`));

    if (!result.exists()) {
      throw new Error(`Post with id ${id} does not exist!`);
    }

    const comments = result.val();
    return comments;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Updates the likes and dislikes of a comment in the database.
 * 
 * @param {string} postId - The ID of the post containing the comment.
 * @param {string} username - The username of the user performing the action.
 * @param {string} commentId - The ID of the comment to be liked.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 * @throws {Error} - If there is an error updating the comment likes.
 */
export const likeComment = async (postId, username, commentId) => {
  try {
    const updateCommentLikes = {};
    const result = await get(
      ref(db, `/posts/${postId}/comments/${commentId}/dislikedBy/${username}`)
    );

    if (result.exists()) {
      const dislikesResult = await get(
        ref(db, `/posts/${postId}/comments/${commentId}/dislikes`)
      );
      updateCommentLikes[`/posts/${postId}/comments/${commentId}/dislikes`] =
        dislikesResult.val() - 1;
      updateCommentLikes[
        `/posts/${postId}/comments/${commentId}/dislikedBy/${username}`
      ] = null;
    }

    const likesResult = await get(
      ref(db, `/posts/${postId}/comments/${commentId}/likes`)
    );
    updateCommentLikes[`/posts/${postId}/comments/${commentId}/likes`] =
      likesResult.val() + 1;
    updateCommentLikes[
      `/posts/${postId}/comments/${commentId}/likedBy/${username}`
    ] = true;

    return update(ref(db), updateCommentLikes);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Decreases the like count of a comment and removes the user's like from the comment.
 * @param {string} postId - The ID of the post containing the comment.
 * @param {string} username - The username of the user who liked the comment.
 * @param {string} commentId - The ID of the comment.
 * @returns {Promise<void>} - A promise that resolves when the comment likes are updated successfully.
 * @throws {Error} - If an error occurs while updating the comment likes.
 */
export const stopLikingComment = async (postId, username, commentId) => {
  try {
    const updateCommentLikes = {};
    const result = await get(
      ref(db, `/posts/${postId}/comments/${commentId}/likes`)
    );

    updateCommentLikes[`/posts/${postId}/comments/${commentId}/likes`] =
      result.val() - 1;
    updateCommentLikes[
      `/posts/${postId}/comments/${commentId}/likedBy/${username}`
    ] = null;

    return update(ref(db), updateCommentLikes);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Dislikes a comment on a post.
 * @param {string} postId - The ID of the post.
 * @param {string} username - The username of the user disliking the comment.
 * @param {string} commentId - The ID of the comment.
 * @returns {Promise<void>} - A promise that resolves when the comment is disliked.
 * @throws {Error} - If an error occurs during the process.
 */
export const dislikeComment = async (postId, username, commentId) => {
  try {
    const updateCommentDislikes = {};
    const result = await get(
      ref(db, `/posts/${postId}/comments/${commentId}/likedBy/${username}`)
    );

    if (result.exists()) {
      const likesResult = await get(
        ref(db, `/posts/${postId}/comments/${commentId}/likes`)
      );
      updateCommentDislikes[`/posts/${postId}/comments/${commentId}/likes`] =
        likesResult.val() - 1;
      updateCommentDislikes[
        `/posts/${postId}/comments/${commentId}/likedBy/${username}`
      ] = null;
    }

    const dislikesResult = await get(
      ref(db, `/posts/${postId}/comments/${commentId}/dislikes`)
    );
    updateCommentDislikes[`/posts/${postId}/comments/${commentId}/dislikes`] =
      dislikesResult.val() + 1;
    updateCommentDislikes[
      `/posts/${postId}/comments/${commentId}/dislikedBy/${username}`
    ] = true;

    return update(ref(db), updateCommentDislikes);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Decreases the dislike count of a comment and removes the user's dislike from the comment.
 * @param {string} postId - The ID of the post containing the comment.
 * @param {string} username - The username of the user who disliked the comment.
 * @param {string} commentId - The ID of the comment.
 * @returns {Promise<void>} - A promise that resolves when the comment dislikes are updated successfully.
 * @throws {Error} - If an error occurs while updating the comment dislikes.
 */
export const stopDislikingComment = async (postId, username, commentId) => {
  try {
    const updateCommentDislikes = {};
    const result = await get(
      ref(db, `/posts/${postId}/comments/${commentId}/dislikes`)
    );

    updateCommentDislikes[`/posts/${postId}/comments/${commentId}/dislikes`] =
      result.val() - 1;
    updateCommentDislikes[
      `/posts/${postId}/comments/${commentId}/dislikedBy/${username}`
    ] = null;

    return update(ref(db), updateCommentDislikes);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Increases the like count of a post and updates the user's liked posts.
 * 
 * @param {string} username - The username of the user liking the post.
 * @param {string} postId - The ID of the post being liked.
 * @returns {Promise<void>} - A promise that resolves when the like count and user's liked posts are updated.
 * @throws {Error} - If an error occurs while updating the like count or user's liked posts.
 */
export const likePost = async (username, postId) => {
  try {
    const updateLikes = {};
    const result = await get(ref(db, `/posts/${postId}/likes`));

    updateLikes[`/posts/${postId}/likes`] = result.val() + 1;
    updateLikes[`/posts/${postId}/likedBy/${username}`] = true;

    const user = await get(ref(db, `/users/${username}/likedPosts`));
    updateLikes[`/users/${username}/likedPosts/`] = user.val() + 1;

    return update(ref(db), updateLikes);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Decreases the like count of a post and removes the user's like from the post.
 * Also updates the user's liked posts count.
 * @param {string} username - The username of the user disliking the post.
 * @param {string} postId - The ID of the post to be disliked.
 * @returns {Promise<void>} - A promise that resolves when the update is completed.
 */
export const dislikePost = async (username, postId) => {
  try {
    const updateLikes = {};
    const result = await get(ref(db, `/posts/${postId}/likes`));

    updateLikes[`/posts/${postId}/likes`] = result.val() - 1;
    updateLikes[`/posts/${postId}/likedBy/${username}`] = null;

    const user = await get(ref(db, `/users/${username}/likedPosts`));
    updateLikes[`/users/${username}/likedPosts/`] = user.val() - 1;

    return update(ref(db), updateLikes);
  } catch (error) {
    console.error(error);
  }
};
