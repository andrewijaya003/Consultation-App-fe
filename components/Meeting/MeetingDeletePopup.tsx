import { RiDeleteBinLine } from '@react-icons/all-files/ri/RiDeleteBinLine'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function MeetingDeletePopup(props:any) {
    const [id, setId] = useState('')
    const moment = require('moment')

    useEffect(() => {
        if(props.meeting != undefined) {
            setId(props.meeting.id)
        }
    }, [props.meeting])

    async function deleteMeetingHandler() {
        if(id != '') {
            await fetch(process.env.BASE_URL + '/meeting', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    "Content-Type" : "application/json"
                },
                method: 'DELETE',
                body: JSON.stringify({
                    id: id
                })
            }).then(res => res.json()).then(props.refetch)
        }
    }

    return (
        props.del ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col justify-center items-center ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <div className='text-red text-bigtitle shadow-md p-6 rounded-full ring-2 ring-red'>
                    <RiDeleteBinLine />
                </div>
                <div className='text-smalltitle font-bold my-3 text-center'>
                    You are about to delete meeting at "{ moment(props.meeting.lastUpdatedTime).format('DD MMMM YYYY') } || { moment(props.meeting.lastUpdatedTime).format('h:mm A') }"
                </div>
                <div className='text-normal mb-0.5 text-center'>
                    This will delete your meeting
                </div>
                <div className='text-normal text-center'>
                    Are you sure?
                </div>
                <div className='flex mt-5'>
                    <div className='flex justify-end mr-3' onClick={props.onClose}>
                        <input type="button" value='Cancel' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                    <div className='flex justify-end'>
                        <input type="button" value='Delete' className='bg-red text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={deleteMeetingHandler} />
                    </div>
                </div>
            </div>
        </div>
        :
        <></>
    )
}

export default MeetingDeletePopup