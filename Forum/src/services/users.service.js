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

export const getUserByUsername = async (username) => {
  return get(ref(db, `users/${username}`));
};

export const unblockUser = async (users, fn, user) => {
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
  await createUserUsername(
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

export const blockUser = async (users, user, fn) => {
  const {
    username,
    firstName,
    lastName,
    uid,
    email,
    isBlocked,
  } = user;
  await createBlockedUsers(
    username,
    firstName,
    lastName,
    uid,
    email
  );
  if (isBlocked) {
    return null;
  }
  await update(ref(db, `users/${username}`), {
    isBlocked: !user.isBlocked,
  });
  const filterUsers = await getAllUsers();
  return fn(Object.values(filterUsers));
};

export const createBlockedUsers = async (
  username,
  firstName,
  lastName,
  uid,
  email
) => {
  return set(ref(db, `blockedUsers/${username}`), {
    username,
    firstName,
    lastName,
    uid,
    email,
  });
};

export const createUserUsername = async (
  username,
  firstName,
  lastName,
  uid,
  email,
  createdOn = new Date().toString(),
  likedPosts = 0,
  posts = {},
  comments = 0
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
    isBlocked: false,
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

export const getUserData = async (uid) => {
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

export const isAdmin = async (username, fn, user) => {
  const { isBlocked } = user;
  if (isBlocked) {
    return null;
  }
  await get(ref(db, `users/${username}`)).val();
  await update(ref(db, `users/${username}`), { admin: !user.admin });
  const allUsers = Object.values(await getAllUsers());
  return fn(allUsers);
};

export const updateUserInfo = async (username, prop, value) => {
  await update(ref(db, `users/${username}`), { [prop]: value });
};
