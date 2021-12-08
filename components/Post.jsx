import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from '@firebase/firestore'
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import { db } from 'firebase.js'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Moment from 'react-moment'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import themeState from 'atoms/themeAtom'
import { useRecoilValue } from 'recoil'

const Post = ({ id, post }) => {
  const { id: user_id, username, userImg, image, caption } = post
  const { data: session } = useSession()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [liked, setLiked] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)
  const dark = useRecoilValue(themeState)

  useEffect(
    () =>
      onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  )

  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  )

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id, 'comments'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  )

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username,
      })
    }
  }

  const sendComment = async (e) => {
    e.preventDefault()

    await addDoc(collection(db, 'posts', id, 'comments'), {
      id: session?.user?.uid,
      comment,
      username: session.user.username,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    })

    setComment('')
  }

  const deletePost = async () => {
    await deleteDoc(doc(db, 'posts', id))
  }

  const addEmoji = (e) => {
    setComment(comment + e.native)
  }

  return (
    <div className='relative bg-1 border b-1 rounded-sm my-7'>
      {/* header */}
      <div className='flex items-center p-5 cl-1'>
        <img
          src={userImg}
          alt='img'
          className='rounded-full h-12 w-12 object-contain border b-1 p-1 mr-3'
        />
        <p className='font-bold flex-1'>{username}</p>
        <DotsHorizontalIcon className='h-5' />
      </div>
      {/* img */}
      <img src={image} className='object-cover w-full' alt='' />
      {/* buttons */}
      {session && (
        <div className='flex justify-between px-5 pt-4 cl-1'>
          <div className='flex space-x-4'>
            {liked ? (
              <HeartIconFilled
                onClick={likePost}
                className='btn-icon text-red-500'
              />
            ) : (
              <HeartIcon onClick={likePost} className='btn-icon' />
            )}
            <ChatIcon className='btn-icon' />
            <PaperAirplaneIcon
              className='btn-icon rotate-45'
              onClick={() => console.log(session?.user?.uid, id)}
            />
          </div>
          <div className='flex items-center space-x-4'>
            {session?.user?.uid === user_id && (
              <TrashIcon
                className='btn-icon hover:text-red-400'
                onClick={() => deletePost()}
              />
            )}
            <BookmarkIcon className='btn-icon hover:text-blue-400' />
          </div>
        </div>
      )}
      {/* caption */}
      <p className='p-5 pb-4 cl-1'>
        {likes.length > 0 && (
          <span className='font-bold block mb-1 cl-1'>
            {likes.length} likes
          </span>
        )}
        <b className='mr-1'>{username} </b>
        {caption}
      </p>

      {/* comments */}
      {comments.length > 0 && (
        <p className='cl-2 ml-5 mb-2'>
          {comments.length} {comments.length > 1 ? 'comments' : 'comment'}
        </p>
      )}
      {comments.length > 0 && (
        <div className='ml-10 max-h-28 scrollbar-thin  dark:scrollbar-thumb-gray-700 scrollbar-thumb-gray-300 overflow-y-scroll'>
          {comments.map((com) => (
            <div key={com.id} className='flex items-start space-x-2'>
              <img
                className='rounded-full h-7 w-7'
                src={com.data().userImg}
                alt=''
              />
              <div className='flex-1'>
                <div className='flex flex-wrap my-1 cl-1 pr-4 text-sm flex-1 space-x-1'>
                  <b>{com.data().username}</b>
                  <p>{com.data().comment}</p>
                </div>
                <div className='w-full pr-5 flex justify-end space-x-6 text-xs cl-2'>
                  {session?.user?.uid === com.data().id && (
                    <b
                      className='cursor-pointer'
                      onClick={() =>
                        deleteDoc(doc(db, 'posts', id, 'comments', com.id))
                      }
                    >
                      Delete
                    </b>
                  )}
                  <Moment fromNow>{com.data().timestamp?.toDate()}</Moment>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {session && (
        <form
          onSubmit={sendComment}
          className='relative flex items-center h-16 pr-4 cl-1'
        >
          <div
            className='h-16 pl-4 pr-2 flex items-center justify-center cursor-pointer'
            onMouseEnter={() => setShowEmojis(true)}
            onMouseLeave={() => setShowEmojis(false)}
          >
            <EmojiHappyIcon className='h-7 w-7' />
          </div>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type='text'
            className='border-none focus:ring-0 w-full sm:flex-1 bg-transparent outline-none'
            placeholder='Add a comment...'
          />
          <button
            type='submit'
            disabled={!comment.trim()}
            className='btn-blue disabled:cursor-not-allowed'
          >
            Post
          </button>
        </form>
      )}
      {showEmojis && (
        <div
          className='absolute bottom-14 left-1 rounded-2xl shadow-lg'
          onMouseEnter={() => setShowEmojis(true)}
          onMouseLeave={() => setShowEmojis(false)}
        >
          <Picker
            onSelect={(e) => addEmoji(e)}
            theme={dark ? 'dark' : 'light'}
            style={{
              maxWidth: '320px',
              borderRadius: '16px',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Post
