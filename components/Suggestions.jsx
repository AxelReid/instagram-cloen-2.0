import { useEffect, useState } from 'react'
import faker from 'faker'

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([])

  useEffect(
    () =>
      setSuggestions(
        [...Array(5)].map((_, i) => {
          const { avatar, username, email } = faker.helpers.contextualCard()
          return {
            id: i,
            avatar,
            username,
            email,
          }
        })
      ),
    []
  )

  return (
    <div>
      <div className='my-4 flex items-center justify-between text-sm'>
        <h3 className='text-sm font-bold cl-2'>Suggestions for you</h3>
        <button className='btn-blue text-gray-600'>See All</button>
      </div>
      <div className='flex flex-col space-y-3'>
        {suggestions.map((sug) => (
          <div key={sug.id} className='flex items-center justify-between'>
            <img
              src={sug.avatar}
              className='w-10 h-10 rounded-full border b-1 p-[2px]'
              alt=''
            />
            <div className='relative flex-1 ml-4'>
              <h2 className='font-semibold text-sm cl-1'>{sug.username}</h2>
              <p className='w-64 truncate cl-2 text-sm'>{sug.email}</p>
            </div>
            <button className='btn-blue text-sm'>Follow</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Suggestions
