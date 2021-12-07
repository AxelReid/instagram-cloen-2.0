import { useSession } from 'next-auth/react'
import MiniProfile from './MiniProfile'
import Posts from './Posts'
import Stories from './Stories'
import Suggestions from './Suggestions'

const Feed = () => {
  const { data: session } = useSession()

  return (
    <main
      className={`maxW grid grid-cols-1 md:max-w-3xl ${
        session && 'md:grid-cols-2 xl:grid-cols-3 xl:max-w-6xl'
      } mt-8 gap-x-7`}
    >
      <section className='col-span-2'>
        <Stories />
        <Posts />
      </section>
      {session && (
        <section className='hidden xl:inline-block md:col-span-1'>
          <div className='sticky top-28'>
            <MiniProfile />
            <Suggestions />
          </div>
        </section>
      )}
    </main>
  )
}

export default Feed
