import { collection, onSnapshot, orderBy, query } from '@firebase/firestore'
import { db } from 'firebase.js'
import { useEffect, useState } from 'react'
import Post from './Post'

const Posts = () => {
  const [posts, setPosts] = useState([])

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
        (snapshot) => setPosts(snapshot.docs)
      ),
    [db]
  )

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post.data()} id={post.id} />
      ))}
    </div>
  )
}

export default Posts
