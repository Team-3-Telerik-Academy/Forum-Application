import { get, set, ref, query, equalTo, orderByChild } from "firebase/database";
import { db } from "../config/firebase-config";

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`)).then((result) => {
    if (!result.exists()) {
      throw new Error(`User with username ${handle} does not exist!`);
    }

    const user = result.val();
    // post.id = id;
    // post.createdOn = new Date(post.createdOn);
    // if (!post.likedBy) post.likedBy = [];

    // console.log(user);
    return user;
  });
  // return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, firstName, lastName, uid, email) => {
  return set(ref(db, `users/${handle}`), {
    handle,
    firstName,
    lastName,
    uid,
    email,
    createdOn: new Date(),
    likedPosts: {},
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
