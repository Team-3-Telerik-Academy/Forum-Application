import {
  get,
  set,
  ref,
  query,
  equalTo,
  orderByChild,
  update,
  remove,
} from "firebase/database";
import { db } from "../config/firebase-config";

export const getUserByUsername = (username) => {
  return get(ref(db, `users/${username}`));
};

// export const getUserByUsername = (username) => {
//   return get(ref(db, `users/${username}`)).then((result) => {
//     if (!result.exists()) {
//       throw new Error(`User with username ${username} does not exist!`);
//     }

//     const user = result.val();
//     // post.id = id;
//     // post.createdOn = new Date(post.createdOn);
//     // if (!post.likedBy) post.likedBy = [];

//     // console.log(user);
//     return user;
//   });
//   // return get(ref(db, `users/${username}`));
// };

export const unblockUser = (users, fn, user) => {
  const {
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn,
    likedPosts,
    posts,
    comments,
    allComments,
  } = user;
  createUserUsername(
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn,
    likedPosts,
    posts,
    comments,
    allComments
  );
  fn([...users].filter((user) => user.username !== username));
  return remove(ref(db, `blockedUsers/${username}`));
};

export const blockUser = (users, fn, user) => {
  const {
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn,
    likedPosts,
    posts,
    comments,
    allComments,
  } = user;
  createBlockedUsers(
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn,
    likedPosts,
    posts,
    comments,
    allComments
  );
  fn([...users].filter((user) => user.username !== username));
  return remove(ref(db, `users/${username}`));
};

export const createBlockedUsers = (
  username,
  firstName,
  lastName,
  uid,
  email,
  createdOn,
  likedPosts,
  posts,
  comments,
  allComments
) => {
  return set(ref(db, `blockedUsers/${username}`), {
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn: createdOn || new Date().toString(),
    likedPosts: likedPosts || 0,
    posts: posts || {},
    comments: comments || 0,
    allComments: allComments || {},
  });
};

export const createUserUsername = (
  username,
  firstName,
  lastName,
  uid,
  email,
  createdOn = new Date().toString(),
  likedPosts = 0,
  posts = {},
  comments = 0,
  allComments = {},
) => {
  return set(ref(db, `users/${username}`), {
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn,
    likedPosts,
    posts,
    comments,
    admin: false,
    allComments,
  });
};

export const getBlockedUsers = () => {
  return get(ref(db, "blockedUsers")).then((snapshot) => {
    if (!snapshot.exists()) {
      return [];
    }

    return snapshot.val();
  });
};

export const getUserData = (uid) => {
  return get(query(ref(db, "users"), orderByChild("uid"), equalTo(uid)));
};

export const getAllUsers = () => {
  return get(ref(db, "users")).then((snapshot) => {
    if (!snapshot.exists()) {
      return [];
    }

    return snapshot.val();
  });
};

export const updateUserComments = (username, commentId, content) => {
  return get(ref(db, `users/${username}/allComments/`)).then((result) => {
    let updateComments = result.exists() ? { ...result.val() } : {};

    updateComments[commentId] = content;

    return update(ref(db, `users/${username}/allComments/`), updateComments);
  });
};

export const updateUserPosts = (username, postId, title) => {
  let updatePosts = {};

  get(ref(db, `users/${username}/posts/`)).then((result) => {
    if (result.exists()) {
      updatePosts = { ...result.val() };
    }

    updatePosts[postId] = title;

    return update(ref(db, `users/${username}/posts/`), updatePosts);
  });
};

export const isAdmin = async (username, fn) => {
  const user = (await get(ref(db, `users/${username}`))).val();
  await update(ref(db, `users/${username}`), { admin: !user.admin });
  const allUsers = Object.values(await getAllUsers());
  return fn(allUsers);
};
