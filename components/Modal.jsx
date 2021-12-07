import modalState from 'atoms/modalAtom'
import { useRecoilState } from 'recoil'
import { Transition, Dialog } from '@headlessui/react'
import { Fragment, useRef, useState } from 'react'
import { CameraIcon } from '@heroicons/react/outline'
import { db, storage } from 'firebase.js'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from '@firebase/firestore'
import { useSession } from 'next-auth/react'
import { ref, getDownloadURL, uploadString } from '@firebase/storage'

const Modal = () => {
  const { data: session } = useSession()
  const fileRef = useRef(null)
  const captionRef = useRef(null)
  const [file, setFile] = useState(null)
  const [open, setOpen] = useRecoilState(modalState)
  const [loading, setLoading] = useState(false)

  const uploadPost = async () => {
    if (loading) return
    setLoading(true)

    const docRef = await addDoc(collection(db, 'posts'), {
      id: session.user.uid,
      username: session.user.username,
      caption: captionRef.current.value,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    })

    const imageRef = ref(storage, `posts/${docRef.id}/image`)

    await uploadString(imageRef, file, 'data_url').then(async (snapshot) => {
      const url = await getDownloadURL(imageRef)

      await updateDoc(doc(db, 'posts', docRef.id), {
        image: url,
      })
    })

    setOpen(false)
    setLoading(false)
    setFile(null)
  }

  const selectFile = (e) => {
    const reader = new FileReader()
    if (e.target?.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (ev) => setFile(ev.target.result)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-10 inset-0 overflow-y-auto'
        onClose={setOpen}
      >
        <div className='flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:scale-95 sm:translate-y-0'
          >
            <div className='inline-block align-bottom bg-1 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:mb-8 mt-20 sm:mt-24 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
              <div>
                {file ? (
                  <img
                    src={file}
                    alt=''
                    className='w-full object-contain cursor-pointer'
                    onClick={() => fileRef.current.click()}
                  />
                ) : (
                  <div
                    className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-opacity-25 cursor-pointer'
                    onClick={() => fileRef.current.click()}
                  >
                    <CameraIcon
                      className='h-6 w-6 dark:text-red-500 text-red-600'
                      aria-hidden='true'
                    />
                  </div>
                )}
                <div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title
                      as='h3'
                      className='text-lg leading-6 font-medium cl-1'
                    >
                      Upload a photo
                    </Dialog.Title>

                    <div className='mt-2'>
                      <input
                        type='file'
                        accept='image/*'
                        hidden
                        onChange={selectFile}
                        ref={fileRef}
                      />
                    </div>

                    <div className='mt-2'>
                      <input
                        ref={captionRef}
                        type='text'
                        className='border-none focus:ring-0 w-full text-center bg-transparent cl-2'
                        placeholder='Please enter a caption'
                      />
                    </div>
                  </div>
                </div>

                <div className='mt-5 sm:mt-6'>
                  <button
                    disabled={!file}
                    className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-opacity-50 disabled:cursor-not-allowed'
                    onClick={uploadPost}
                  >
                    {loading ? 'Uploading...' : 'Upload Post'}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
