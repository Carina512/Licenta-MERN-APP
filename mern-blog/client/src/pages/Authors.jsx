import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../components/Loader'

const Authors = () => {
    const [authors, setAuthors] = useState([])
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const getauthors = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`)
                setAuthors(response.data);
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        }

        getauthors()
    }, [])

    const deleteAuthor = async (authorId) => {
      try {
          await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${authorId}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}` 
              }
          });
          setAuthors(authors.filter(author => author._id !== authorId));
      } catch (error) {
          console.error('Failed to delete author:', error);
      }
  };

    if(isLoading) {
        return <Loader/>
    }


  return (
    <section className="authors">
        {authors.length ? <div className="container authors__container">
            {authors.map(author => {
                return <div key={author?._id} to={`/posts/users/${author?._id}`} className="author">
                <div className="author__avatar">
                    <img src={`${process.env.REACT_APP_ASSET_URL}/uploads/${author.avatar}`} alt={author?.name} />
                </div>
                <div className='author__info'>
                    <h4>{author?.name}</h4>
                    <p>{author?.posts} posts</p>
                </div>
                <button onClick={() => deleteAuthor(author._id)} className="delete-button">
                                Delete
                            </button>
            </div>
            })}
        </div> : <h2 className='center'>No Authors Found</h2>}
    </section>
  )
}

export default Authors