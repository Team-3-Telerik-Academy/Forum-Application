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

/**
 * Retrieves a user by their username.
 *
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<any>} A promise that resolves with the user data.
 */
export const getUserByUsername = async (username) => {
  return get(ref(db, `users/${username}`));
};

/**
 * Unblock a user.
 * 
 * @param {Array} users - The array of users.
 * @param {Function} fn - The function to update the users list.
 * @param {Object} user - The user object to unblock.
 * @param {string} user.username - The username of the user.
 * @param {string} user.firstName - The first name of the user.
 * @param {string} user.lastName - The last name of the user.
 * @param {string} user.uid - The unique identifier of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.createdOn - The creation date of the user.
 * @param {Array} user.likedPosts - The array of liked posts by the user.
 * @param {Array} user.posts - The array of posts created by the user.
 * @param {Array} user.comments - The array of comments made by the user.
 * @returns {Promise} A promise that resolves when the user is unblocked.
 */
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

/**
 * Blocks a user and updates the user's block status.
 * @param {Array} users - The array of users.
 * @param {Object} user - The user object to be blocked.
 * @param {Function} fn - The callback function to be called after blocking the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of filtered users.
 */
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

/**
 * Creates a new blocked user entry in the database.
 * @param {string} username - The username of the blocked user.
 * @param {string} firstName - The first name of the blocked user.
 * @param {string} lastName - The last name of the blocked user.
 * @param {string} uid - The unique identifier of the blocked user.
 * @param {string} email - The email address of the blocked user.
 * @returns {Promise<void>} - A promise that resolves when the blocked user entry is created.
 */
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

/**
 * Creates a new user with the provided information.
 *
 * @param {string} username - The username of the user.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} uid - The unique identifier of the user.
 * @param {string} email - The email address of the user.
 * @param {string} [createdOn=new Date().toString()] - The date and time when the user was created. Defaults to the current date and time.
 * @param {number} [likedPosts=0] - The number of posts liked by the user. Defaults to 0.
 * @param {Object} [posts={}] - The posts created by the user. Defaults to an empty object.
 * @param {number} [comments=0] - The number of comments made by the user. Defaults to 0.
 * @returns {Promise<void>} A promise that resolves when the user is successfully created.
 */
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

/**
 * Retrieves the list of blocked users from the database.
 * @returns {Promise<Object>} A promise that resolves to an Object of blocked users.
 */
export const getBlockedUsers = () => {
  return get(ref(db, "blockedUsers")).then((snapshot) => {
    if (!snapshot.exists()) {
      return [];
    }

    return snapshot.val();
  });
};

/**
 * Retrieves user data based on the provided UID.
 *
 * @param {string} uid - The UID of the user.
 * @returns {Promise} A promise that resolves with the user data.
 */
export const getUserData = async (uid) => {
  return get(query(ref(db, "users"), orderByChild("uid"), equalTo(uid)));
};

/**
 * Retrieves all users from the database.
 * @returns {Promise<Object>} A promise that resolves to an Object of users.
 */
export const getAllUsers = () => {
  return get(ref(db, "users")).then((snapshot) => {
    if (!snapshot.exists()) {
      return [];
    }

    return snapshot.val();
  });
};

/**
 * Updates the user's posts with a new post.
 * @param {string} username - The username of the user.
 * @param {string} postId - The ID of the post.
 * @param {string} title - The title of the post.
 * @returns {Promise<void>} A promise that resolves when the user's posts are updated.
 */
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

/**
 * Checks if a user is an admin and performs necessary actions.
 * 
 * @param {string} username - The username of the user.
 * @param {Function} fn - The callback function to be executed.
 * @param {object} user - The user object containing user details.
 * @returns {Promise<Array>} - A promise that resolves to an array of all users.
 */
export const isAdmin = async (username, fn, user) => {
  const { isBlocked } = user;
  if (isBlocked) {
    return null;
  }
  await update(ref(db, `users/${username}`), { admin: !user.admin });
  const allUsers = Object.values(await getAllUsers());
  return fn(allUsers);
};

/**
 * Updates the user information in the database.
 * @param {string} username - The username of the user.
 * @param {string} prop - The property to update.
 * @param {any} value - The new value for the property.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
export const updateUserInfo = async (username, prop, value) => {
  await update(ref(db, `users/${username}`), { [prop]: value });
};
