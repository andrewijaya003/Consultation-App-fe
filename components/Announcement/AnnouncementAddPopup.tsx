import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import PageTitle2 from '../PageTitle2'
import AlertNoData from '../AlertNoData';
import AlertError from '../AlertError';

function AnnouncementAddPopup(props:any) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    async function addAnnouncementHandler() {
        if(title == '') {
            setErrorMsg('Title must be filled')
        } else if(description == '') {
            setErrorMsg('Description must be filled')
        }

        if(title !== '' && description !== '') {
            let announcement = new FormData()
            announcement.append('title', title)
            announcement.append('description', description)
            announcement.append('target', 'ALL')
            announcement.append('file', image)
            
            await fetch(process.env.BASE_URL + '/announcement', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                },
                method: 'POST',
                body: announcement
            }).then(res => res.json()).then(() => router.reload())
        }
        
        
    }

    return (
        props.add ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <PageTitle2 title='New Announcement' sectitle='announcement' />
                <form className='flex flex-col mt-6'>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='title' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Title <div className='text-red'>*</div>
                        </label>
                        <input name='title' id='title' type='text' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setTitle(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Description <div className='text-red'>*</div>
                        </label>
                        <textarea name='description' id='description' maxLength='500' rows="8" className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Image <div className='text-red'></div>
                        </label>
                        <div className="flex justify-center">
                            <input className="w-full cursor-pointer border border-gray-300 focus:ring-1 focus:border-blue text-sm rounded-md file:px-3 file:py-2 bg-white file:border-0" aria-describedby="user_avatar_help" id="user_avatar" type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                    </div>
                    <div className='h-px bg-secblack my-2' />
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2'>
                        <input type="button" value='Create' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={addAnnouncementHandler} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default AnnouncementAddPopup