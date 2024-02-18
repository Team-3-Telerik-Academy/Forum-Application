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

export const editPost = async (postId, title, content) => {
  try {
    const postToEdit = ref(db, `/posts/${postId}`);
    await update(postToEdit, { title: title, content: content });
  } catch (error) {
    console.error(error);
  }
};

export const adminPanelDeletePost = async (id, posts, setFn) => {
  const postToDelete = ref(db, `/posts/${id}`);
  const author = await get(ref(db, `/posts/${id}/author`));
  const username = author.val();
  const authorPosts = ref(db, `users/${username}/posts/${id}`);
  setFn([...posts].filter((post) => post.id !== id));
  await remove(authorPosts);
  await remove(postToDelete);
};

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

export const editTagPost = async (postId, tagId, content) => {
  try {
    const tagToEdit = ref(db, `/posts/${postId}/tags/${tagId}`);
    await set(tagToEdit, content);
  } catch (error) {
    console.error(error);
  }
};

export const deleteTagPost = async (postId, tagId) => {
  try {
    const tagToDelete = ref(db, `/posts/${postId}/tags/${tagId}`);
    return remove(tagToDelete);
  } catch (error) {
    console.error(error);
  }
};

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

export const editCommentPost = async (postId, commentId, content) => {
  try {
    const commentToEdit = ref(db, `/posts/${postId}/comments/${commentId}`);
    await update(commentToEdit, { content: content });
  } catch (error) {
    console.error(error);
  }
};

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
