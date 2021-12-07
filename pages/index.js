import Feed from 'components/Feed'
import Header from 'components/Header'
import Modal from 'components/Modal'
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Instagram v2.0 Clone</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Feed />
      <Modal />
    </div>
  )
}
