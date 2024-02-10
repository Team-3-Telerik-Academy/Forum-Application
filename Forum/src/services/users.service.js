import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, firstName, lastName, uid, email) => {

  return set(ref(db, `users/${handle}`), { handle, firstName, lastName, uid, email, createdOn: new Date(), likedPosts: {} })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const getAllUsers = () => {

  return get(ref(db, 'users'))
      .then(snapshot => {
          if (!snapshot.exists()) {
              return [];
          }

          return snapshot.val();
      });
};