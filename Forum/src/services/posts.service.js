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

export const fromPostsDocument = (snapshot) => {
  const postsDocument = snapshot.val();

  return Object.keys(postsDocument).map((key) => {
    const post = postsDocument[key];

    return {
      ...post,
      id: key,
      createdOn: new Date(post.createdOn),
      // .toLocaleString("bg-BG", {
      //   year: "numeric",
      //   month: "numeric",
      //   day: "numeric",
      //   hour: "2-digit",
      //   minute: "2-digit",
      // }),
      likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
    };
  });
};

export const addPost = (title, content, category, handle) => {
  return push(ref(db, "posts"), {
    title,
    content,
    category,
    author: handle,
    createdOn: new Date().toString(),
    comments: {},
    likes: 0,
    likedBy: {},
  }).then((result) => {
    return getPostById(result.key);
  });
};

export const editPost = (postId, title, content) => {
  const postToEdit = ref(db, `/posts/${postId}`);

  return update(postToEdit, { title: title, content: content });
};

export const deletePost = (postId) => {
  const postToDelete = ref(db, `/posts/${postId}`);

  return remove(postToDelete);
};

export const getPostById = (id) => {
  return get(ref(db, `posts/${id}`)).then((result) => {
    if (!result.exists()) {
      throw new Error(`Post with id ${id} does not exist!`);
    }

    const post = result.val();
    post.id = id;
    post.createdOn = new Date(post.createdOn);
    if (!post.likedBy) post.likedBy = [];

    return post;
  });
};

export const getLikedPosts = (handle) => {
  return get(ref(db, `users/${handle}`)).then((snapshot) => {
    if (!snapshot.val()) {
      throw new Error(`User with handle @${handle} does not exist!`);
    }

    const user = snapshot.val();
    if (!user.likedPosts) return [];

    return Promise.all(
      Object.keys(user.likedPosts).map((key) => {
        return get(ref(db, `posts/${key}`)).then((snapshot) => {
          const post = snapshot.val();

          return {
            ...post,
            createdOn: new Date(post.createdOn),
            id: key,
            likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
          };
        });
      })
    );
  });
};

export const getPostsByAuthor = (handle) => {
  return get(
    query(ref(db, "posts"), orderByChild("author"), equalTo(handle))
  ).then((snapshot) => {
    if (!snapshot.exists()) return [];

    return fromPostsDocument(snapshot);
  });
};

export const getPostsByCategory = (category) => {
  return get(
    query(
      ref(db, "posts"),
      orderByChild("category"),
      equalTo(category.toLowerCase())
    )
  ).then((snapshot) => {
    if (!snapshot.exists()) return [];

    return fromPostsDocument(snapshot);
  });
};

export const getAllPosts = () => {
  return get(ref(db, "posts")).then((snapshot) => {
    if (!snapshot.exists()) {
      return [];
    }

    return fromPostsDocument(snapshot);
  });
};

export const addCommentPost = (handle, postId, comment, firstName, lastName) => {
  const commentKey = push(ref(db, `/posts/${postId}/comments`));

  return set(commentKey, {
    handle: handle,
    firstName: firstName,
    lastName: lastName,
    content: comment,
    createdOn: new Date().toString(),
  });
};

export const editCommentPost = (postId, commentId, content) => {
  const commentToEdit = ref(db, `/posts/${postId}/comments/${commentId}`);

  return update(commentToEdit, { content: content });
};

export const deleteCommentPost = (postId, commentId) => {
  const commentToDelete = ref(db, `/posts/${postId}/comments/${commentId}`);

  return remove(commentToDelete);
};

export const getCommentsOfAPost = (id) => {
  return get(ref(db, `posts/${id}/comments`)).then((result) => {
    if (!result.exists()) {
      throw new Error(`Post with id ${id} does not exist!`);
    }

    const comments = result.val();

    return comments;
  });
};

export const likePost = (handle, postId) => {
  const updateLikes = {};

  get(ref(db, `/posts/${postId}/likes`)).then((result) => {
    updateLikes[`/posts/${postId}/likes`] = result.val() + 1;
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;

    return update(ref(db), updateLikes);
  });

};

export const dislikePost = (handle, postId) => {
  const updateLikes = {};

  get(ref(db, `/posts/${postId}/likes`)).then((result) => {
    updateLikes[`/posts/${postId}/likes`] = result.val() - 1;
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = null;

    return update(ref(db), updateLikes);
  });
};
