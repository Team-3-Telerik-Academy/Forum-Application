import { get, set, ref, query, equalTo, orderByChild, update } from "firebase/database";
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

export const createUserUsername = (username, firstName, lastName, uid, email) => {
  return set(ref(db, `users/${username}`), {
    username,
    firstName,
    lastName,
    uid,
    email,
    createdOn: new Date(),
    likedPosts: {},
    posts: {},
    comments: 0,
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
      updatePosts = {...result.val()};
    }

    updatePosts[postId] = title;

    return update(ref(db, `users/${username}/posts/`), updatePosts);
  });

};


// to continue....

// export const updateUserComments = (username) => {
//   const updateComments = [];

//   get(ref(db, `users/${username}/`)).then((result) => {

//       updateComments[comments] = result.val() + 1;

//     console.log(updateComments);

//     return update(ref(db, `users/${username}/comments/`), updateComments);
//   });

// };