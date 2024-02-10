import { useParams } from "react-router-dom";

const Post = () => {
    const {id} = useParams;

    const example = {
        author: 'Author',
        category: 'Art',
        content: '123456789',
        createdOn: new Date().toLocaleDateString('BG-bg'),
        comments: [1,2,3,4],
        likedBy: ['Pesho', 'Gosho', 'Penka'],
    }
    
    return (
        <>
        <h1>Single Post</h1>
        <h1>Id: {id}</h1>
        </>
    )
}

export default Post;