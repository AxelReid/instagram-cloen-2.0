import { signOut, useSession } from 'next-auth/react'

const MiniProfile = () => {
  const { data: session } = useSession()

  return (
    <div className='flex items-center justify-between mt-6'>
      <img
        className='rounded-full p-[2px] w-16 h-16'
        src={session?.user?.image}
        alt=''
      />

      <div className='flex-1 ml-4'>
        <h2 className='font-bold cl-1'>{session.user.username}</h2>
        <h3 className='text-sm cl-2'>Welcome to Instagram</h3>
      </div>

      <button className='btn-blue text-sm' onClick={signOut}>
        Sign Out
      </button>
    </div>
  )
}

export default MiniProfile
