import { ImCross } from '@react-icons/all-files/im/ImCross'
import { getCookie } from 'cookies-next'
import React, { useEffect } from 'react'
import CardFiles from './CardFiles'

function FilePopup(props:any) {
    useEffect(() => {
        console.log(props.files)
    }, [])

    async function sendFilesHandler() {
        let sendFiles = new FormData()
        for(let i = 0; i < props.files.length; i++) {
            sendFiles.append('files', props.files[i])
        }
        sendFiles.append('roomId', props.roomChatId)

        await fetch(process.env.BASE_URL + '/chat/multiple', {
            headers : { 
                'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
            },
            method: 'POST',
            body: sendFiles
        }).then((res) => res.json()).then(props.onClose)
    }
    
    return (
        props.fixFiles.length !== 0 ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full flex flex-col justify-center items-center ml-auto mr-auto text-secblack bg-white rounded-md' onClick={props.onClose}>
                <div className='w-full flex justify-between items-center text-normal font-bold px-6 pt-6'>
                    <div className=''>
                        Send Files
                    </div>
                    <ImCross size={12} color='rgb(156 163 175)' className='hover:cursor-pointer' onClick={props.onClose} />
                </div>
                {/* <div className='text-smalltitle font-bold my-3 text-center'>
                    You are about to delete "{props.announcement.title}" announcement
                </div>
                <div className='text-normal mb-0.5 text-center'>
                    This will delete your announcement from home
                </div>
                <div className='text-normal text-center'>
                    Are you sure?
                </div>
                <div className='flex mt-5'>
                    <div className='flex justify-end mr-3' onClick={props.onClose}>
                        <input type="button" value='Cancel' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                    <div className='flex justify-end' onClick={deleteAnnouncementHandler}>
                        <input type="button" value='Delete' className='bg-red text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                </div> */}
                <div className='files-container w-full display-scrollbar'>
                    {
                        props.fixFiles.map((src, index) => (
                            <CardFiles src={src} fileName={props.files[index].name} fileSize={props.files[index].size} fileExt={props.files[index].type} />
                        ))
                    }
                </div>
                <div className='w-full px-6 pb-6'>
                    <input type="button" value={'Send ('+props.fixFiles.length+')'} className='w-full py-2 rounded-md bg-blue text-white font-bold hover:cursor-pointer' onClick={sendFilesHandler} />
                </div>
            </div>
        </div> : <></>
    )
}

export default FilePopup