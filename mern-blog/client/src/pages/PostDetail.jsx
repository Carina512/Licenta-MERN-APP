import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import PostAuthor from '../components/PostAuthor'
import { UserContext } from '../context/userContext'
import Loader from '../components/Loader'

const PostDetail = () => {
    const { id } = useParams()
    const [post, setPost] = useState(null);
    const [creatorID, setCreatorID] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext)
    const token = currentUser?.token;
    


    useEffect(() => {
        const getPost = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
                setPost(response.data);
                setCreatorID(response.data.creator)
                const commentsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}/comments`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
                setComments(commentsResponse.data);
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        }
        getPost();
    }, [id,token])

    const handleCommentSubmit = async () => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/posts/${id}/comments`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([...comments, response.data]);
            setNewComment('');
            window.location.reload();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    if (isLoading) {
        return <Loader />
    }

    const removePost = async () => {
        const response = await axios.delete(`http://localhost:5000/api/posts/${id}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
        if (!response) {
            setError("Post deletion failed. Please try again")
        }

        navigate('/')
    }
    
    return (
        <section className='post-detail'>
            {error && <p className='error'>{error}</p>}
            {post && <div className="container post-detail__container">
                <div className="post-detail__header">
                    <PostAuthor authorID={creatorID} createdAt={post?.createdAt} />
                    {currentUser?.id === post?.creator && <div className="post-detail__buttons">
                        <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">Edit</Link>
                        <Link className='btn sm danger' onClick={removePost}>Delete</Link>
                    </div>}
                </div>
                <h1>{post?.title}</h1>
                <div className="post-detail__thumbnail">
                    <img src={`${process.env.REACT_APP_ASSET_URL}/uploads/${post?.thumbnail}`} alt="" />
                </div>
                <p dangerouslySetInnerHTML={{ __html: post?.description }} />
                <div className="comments-section">
                    <h3>Comments</h3>
                    <ul className="comment-list">
                        {comments.map((comment, index) => (
                            <li key={index} className="comment-item">
                                <strong>{comment.author && comment.author.name}</strong> {comment.content}
                                <span>Posted at: {new Date(comment.createdAt).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                    {currentUser ? (
                        <div className="comment-form">
                            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} />
                            <button onClick={handleCommentSubmit}>Post Comment</button>
                        </div>
                    ) : (
                        <p>You must be logged in to post a comment. <Link to="/login"><b>Login here</b></Link>.</p>
                    )}
                </div>
            </div>}
               
           
        </section>
    )
}

export default PostDetail
