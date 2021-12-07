import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
  HeartIcon,
  PaperAirplaneIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/outline'
import { HomeIcon } from '@heroicons/react/solid'
import { signOut, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import modalState from 'atoms/modalAtom'

const Header = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [open, setOpen] = useRecoilState(modalState)
  const [dark, setDark] = useState(false)

  const pushTo = (route) => router.push(route)

  const themeSwitch = () => {
    const html = document.documentElement.classList
    if (html.value === '') {
      html.add('dark')
      localStorage.setItem('dark', true)
      setDark(true)
    } else {
      html.remove('dark')
      localStorage.removeItem('dark')
      setDark(false)
    }
  }

  useEffect(() => {
    const html = document.documentElement.classList
    const saved = localStorage.getItem('dark')
    if (!saved) return
    html.add('dark')
    setDark(true)
  }, [])

  return (
    <header className='sticky top-0 flex items-center bg-1 border-b b-1 h-20 shadow-sm z-50'>
      <div className='maxW flex items-center justify-between'>
        <div
          className='relative hidden lg:inline w-[150px] h-12'
          onClick={() => pushTo('/')}
        >
          <Image
            src='/images/txt_logo.png'
            layout='fill'
            objectFit='contain'
            className='dark:invert'
            priority
          />
        </div>
        <div
          className='relative lg:hidden w-14 h-14 flex-shrink-0'
          onClick={() => pushTo('/')}
        >
          <Image src='/images/logo.png' layout='fill' objectFit='contain' />
        </div>

        <div className='relative flex items-center max-w-sm sm:mr-0 mr-4'>
          <div className='absolute pl-3 flex items-center pointer-events-none cl-1'>
            <SearchIcon className='w-5 h-5 cl-2' />
          </div>
          <input
            type='text'
            placeholder='Search'
            className='b-1 border bg-2 w-full pl-10 block rounded-md focus:ring-gray-500 focus:border-gray-500'
          />
        </div>

        <div className='flex items-center space-x-2 md:space-x-4 justify-end mr-2'>
          <div onClick={() => themeSwitch()}>
            {dark ? (
              <SunIcon className='cl-1 w-6 h-6 cursor-pointer' />
            ) : (
              <MoonIcon className='cl-1 w-6 h-6 cursor-pointer' />
            )}
          </div>
          <HomeIcon className='btnNav' onClick={() => pushTo('/')} />
          <MenuIcon className='h-6 w-6 cl-1 md:hidden cursor-pointer flex-shrink-0' />
          {session ? (
            <>
              <div className='btnNav relative'>
                <PaperAirplaneIcon className='rotate-45' />
                <span className='absolute -top-1 -right-2 rounded-full bg-red-500 w-5 h-5 text-center text-sm text-white animate-pulse'>
                  3
                </span>
              </div>
              <PlusCircleIcon
                onClick={() => setOpen(true)}
                className='btnNav'
              />
              <UserGroupIcon className='btnNav' />
              <HeartIcon className='btnNav' />
              <img
                src={session.user.image}
                onClick={signOut}
                className='w-10 h-10 rounded-full bg-2 border b-1 cursor-pointer'
              />
            </>
          ) : (
            <button className='btn-blue' onClick={() => signIn()}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
