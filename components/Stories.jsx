import { useEffect, useState } from 'react'
import faker from 'faker'
import Story from './Story'
import { useSession } from 'next-auth/react'

const Stories = () => {
  const [stories, setStories] = useState([])
  const { data: session } = useSession()

  useEffect(
    () =>
      setStories(
        [...Array(11)].map((_, i) => {
          const { avatar, username } = faker.helpers.contextualCard()
          return {
            id: i,
            avatar,
            username,
          }
        })
      ),
    []
  )

  return (
    <div className='flex items-center overflow-x-scroll space-x-2 p-6 bg-1 border b-1 rounded-sm scrollbar-thin  dark:scrollbar-thumb-gray-700 scrollbar-thumb-gray-300'>
      {session && (
        <Story
          key='my-story'
          username={session.user.username}
          avatar={session.user.image}
        />
      )}
      {stories?.map((profile) => (
        <Story key={profile.id} {...profile} />
      ))}
    </div>
  )
}

export default Stories
