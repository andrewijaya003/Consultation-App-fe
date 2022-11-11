import { RiDeleteBinLine } from '@react-icons/all-files/ri/RiDeleteBinLine'
import React from 'react'

function MeetingDeletePopup(props:any) {
    return (
        props.del ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col justify-center items-center ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <div className='text-red text-bigtitle shadow-md p-6 rounded-full ring-2 ring-red'>
                    <RiDeleteBinLine />
                </div>
                <div className='text-smalltitle font-bold my-3 text-center'>
                    You are about to delete meeting at "{props.meeting.date} || {props.meeting.time}"
                </div>
                <div className='text-normal mb-0.5 text-center'>
                    This will delete your meeting
                </div>
                <div className='text-normal text-center'>
                    Are you sure?
                </div>
                <div className='flex mt-5'>
                    <div className='flex justify-end mr-3' onClick={props.onClose}>
                        <input type="submit" value='Cancel' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                    <div className='flex justify-end'>
                        <input type="submit" value='Delete' className='bg-red text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                </div>
            </div>
        </div>
        :
        <></>
    )
}

export default MeetingDeletePopup