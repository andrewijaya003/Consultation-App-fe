import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { RiDeleteBinLine } from '@react-icons/all-files/ri/RiDeleteBinLine'
import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import AlertNoData from '../AlertNoData'
import MeetingDeletePopup from './MeetingDeletePopup'
import MeetingEditPopup from './MeetingEditPopup'

function MeetingList(props:any) {
    const moment = require('moment')
    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)
    const [meeting, setMeeting] = useState('')
    // const [meetings, setMeetings] = useState([])
    // const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     setLoading(true)
    //     fetch(process.env.BASE_URL+'/meeting', {
    //         headers: {
    //             'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
    //         },
    //         method: 'GET',
    //     }).then(
    //         res => res.json()
    //     ).then(data => {
    //         setMeetings(data)
    //         setLoading(false)
    //     })
    // }, [])

    function editHandler(meeting:any){
        setEdit(true)
        setMeeting(meeting)
    }

    function deleteHandler(meeting:any){
        setDel(true)
        setMeeting(meeting)
    }
    // ${meeting.status === 'Done' ? 'border-[#30b42c]' : meeting.status === 'Pending' ? 'border-blue' : meeting.status === 'Canceled' ? 'border-red' : ''}
    return (
        <>
            <div className='flex flex-col'>
                {
                    props.meetings.length === 0 ?
                    <AlertNoData title='meeting' />
                    :
                    props.meetings.map((meeting:any) => (
                        <div className={`text-secblack flex sm:flex-col w-full lg:flex-row sm:items-center lg:items-start bg-white border border-gray-300 rounded-lg px-6 py-5 mb-6 shadow-xm `}>
                            <div className='flex flex-col w-full'>
                                <div className='flex justify-between w-full'>
                                    <div className='text-start mb-2 text-[19px] font-bold whitespace-pre-wrap break-all'>
                                        Meeting with {meeting.user.code} - {meeting.user.name}
                                    </div>
                                    <div className={`${meeting.status === 'Done' ? 'text-[#83d475]' : meeting.status === 'Pending' ? 'text-yellow' : 'text-red'}  items-center text-normal font-bold`}>
                                        {meeting.status}
                                    </div>
                                </div>
                                <div className='text-justify text-smalltext whitespace-pre-wrap break-all mb-8'>
                                    { moment(meeting.startTime).format('DD MMMM YYYY') } || { moment(meeting.startTime).format('hh:mm A') }
                                </div>
                                <div className='text-justify text-smalltext whitespace-pre-wrap break-all mb-2'>
                                    { meeting.description }
                                </div>
                                {
                                    meeting.note !== null ? 
                                    <>
                                        <div className='w-fit mb-4'>
                                            <div className="relative">
                                                <div className='text-justify text-smalltext whitespace-pre-wrap break-all mt-4 block px-2.5 py-2 w-full text-smalltext text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer whitespace-pre-wrap break-all'>
                                                    { meeting.note }
                                                </div>
                                                <label
                                                    htmlFor="search"
                                                    className="absolute text-smalltext text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                                                >
                                                    Notes
                                                </label>
                                            </div>
                                        </div>
                                        <div className='text-justify text-smalltext whitespace-pre-wrap break-all text-blue font-bold'>
                                            Press edit button to edit notes
                                        </div>
                                    </>
                                    :
                                    <div className='text-justify text-smalltext whitespace-pre-wrap break-all text-blue font-bold'>
                                        Press edit button to input notes
                                    </div>
                                }
                                <div className='text-end text-tinytext text-gray-400 mt-4'>
                                    Updated by { meeting.updatedByStaff != null ? meeting.updatedByStaff.name : 'Admin' } on { moment(meeting.lastUpdate).format('DD MMMM YYYY') }
                                </div>
                                <div className="text-end text-smalltext font-bold flex w-full justify-end mt-2">
                                    <div className='flex py-2 px-4 rounded bg-yellow items-center text-white mr-3 hover:cursor-pointer' onClick={() => editHandler(meeting)}>
                                        <FiEdit2 className='text-smalltitle mr-1.5' />
                                        Edit
                                    </div>
                                    <div className='flex py-2 px-4 rounded bg-red items-center text-white hover:cursor-pointer' onClick={() => deleteHandler(meeting)}>
                                        <RiDeleteBinLine className='text-smalltitle mr-1.5' />
                                        Delete
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <MeetingEditPopup meeting={meeting} edit={edit} onClose={() => setEdit(false)} /> 
            <MeetingDeletePopup meeting={meeting} del={del} onClose={() => setDel(false)} />
        </>
    )
}

export default MeetingList