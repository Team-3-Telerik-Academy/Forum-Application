import { ref, push, get, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

const fromTweetsDocument = snapshot => {
    const tweetsDocument = snapshot.val();

    return Object.keys(tweetsDocument).map(key => {
        const tweet = tweetsDocument[key];

        return {
            ...tweet,
            id: key,
            createdOn: new Date(tweet.createdOn),
            likedBy: tweet.likedBy ? Object.keys(tweet.likedBy) : [],
        };
    });
}

export const addTweet = (title, content, category, handle) => {

    return push(
        ref(db, 'tweets'),
        {
            title,
            content,
            category,
            author: handle,
            createdOn: Date.now(),
        },
    )
        .then(result => {

            return getTweetById(result.key);
        });
};

export const getTweetById = (id) => {

    return get(ref(db, `tweets/${id}`))
        .then(result => {
            if (!result.exists()) {
                throw new Error(`Tweet with id ${id} does not exist!`);
            }

            const tweet = result.val();
            tweet.id = id;
            tweet.createdOn = new Date(tweet.createdOn);
            if (!tweet.likedBy) tweet.likedBy = [];

            return tweet;
        });
};

export const getLikedTweets = (handle) => {

    return get(ref(db, `users/${handle}`))
        .then(snapshot => {
            if (!snapshot.val()) {
                throw new Error(`User with handle @${handle} does not exist!`);
            }

            const user = snapshot.val();
            if (!user.likedTweets) return [];

            return Promise.all(Object.keys(user.likedTweets).map(key => {

                return get(ref(db, `tweets/${key}`))
                    .then(snapshot => {
                        const tweet = snapshot.val();

                        return {
                            ...tweet,
                            createdOn: new Date(tweet.createdOn),
                            id: key,
                            likedBy: tweet.likedBy ? Object.keys(tweet.likedBy) : [],
                        };
                    });
            }));
        });
};

export const getTweetsByAuthor = (handle) => {

    return get(query(ref(db, 'tweets'), orderByChild('author'), equalTo(handle)))
        .then(snapshot => {
            if (!snapshot.exists()) return [];

            return fromTweetsDocument(snapshot);
        });
};

export const getPostsByCategory = (category) => {

    return get(query(ref(db, 'tweets'), orderByChild('category'), equalTo(category.toLowerCase())))
        .then(snapshot => {
            if (!snapshot.exists()) return [];

            return fromTweetsDocument(snapshot);
        });
};

export const getAllTweets = () => {

    return get(ref(db, 'tweets'))
        .then(snapshot => {
            if (!snapshot.exists()) {
                return [];
            }

            return fromTweetsDocument(snapshot);
        });
};

export const likeTweet = (handle, tweetId) => {
    const updateLikes = {};
    updateLikes[`/tweets/${tweetId}/likedBy/${handle}`] = true;
    updateLikes[`/users/${handle}/likedTweets/${tweetId}`] = true;

    return update(ref(db), updateLikes);
};

export const dislikeTweet = (handle, tweetId) => {
    const updateLikes = {};
    updateLikes[`/tweets/${tweetId}/likedBy/${handle}`] = null;
    updateLikes[`/users/${handle}/likedTweets/${tweetId}`] = null;

    return update(ref(db), updateLikes);
};