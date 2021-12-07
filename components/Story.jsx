const Story = ({ username, avatar }) => {
  return (
    <div>
      <img
        src={avatar}
        alt='user'
        className='w-14 h-14 p-[1.5px] rounded-full border-2 border-red-500 object-contain cursor-pointer hover:scale-105 transition-transform duration-200 ease-out'
      />
      <p className='cl-1 text-xs w-14 truncate text-center'>{username}</p>
    </div>
  )
}

export default Story
