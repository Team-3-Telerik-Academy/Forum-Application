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
    comments
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
    comments
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
  comments
) => {
  return set(ref(db, `blockedUsers/${username}`), {
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn: createdOn || {},
    likedPosts: likedPosts || {},
    posts: posts || {},
    comments: comments,
  });
};

export const createUserUsername = (
  username,
  firstName,
  lastName,
  uid,
  email
) => {
  return set(ref(db, `users/${username}`), {
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn: new Date().toString(),
    likedPosts: 0,
    posts: {},
    comments: 0,
    admin: false,
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
