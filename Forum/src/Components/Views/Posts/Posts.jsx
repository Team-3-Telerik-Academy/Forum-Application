import { useEffect, useState } from "react";
import { getPostsByCategory } from "../../../services/tweets.service";
import { useParams } from "react-router-dom";

//to write the view
const Posts = () => {
    const {type} = useParams();
    // console.log(type);
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        getPostsByCategory(type).then(setPosts);
        // console.log(posts);
    }, [])

    return (
        <>
        <h1>{type.charAt(0).toUpperCase() + type.slice(1)} Category Posts:</h1>
        {posts?.length !== 0 && <h3>Success</h3>}
        </>
    )
}

export default Posts;