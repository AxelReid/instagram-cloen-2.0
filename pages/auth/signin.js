import Header from 'components/Header'
import Head from 'next/head'
import { getProviders, signIn } from 'next-auth/react'

const Signin = ({ providers }) => {
  return (
    <>
      <Head>
        <title>Sign In to Instragram v2.0 Clone</title>
      </Head>
      <Header />
      <div className='maxW flex flex-col items-center justify-center'>
        <img
          src='/images/txt_logo.png'
          className='dark:invert w-80 mt-28'
          alt=''
        />
        <p className='font-sx italic cl-1 text-center'>
          This is not a REAL app, it is built for educational purposes only.
        </p>
        <div className='mt-40'>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className='p-3 bg-blue-500 text-white rounded-lg'
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

export default Signin
