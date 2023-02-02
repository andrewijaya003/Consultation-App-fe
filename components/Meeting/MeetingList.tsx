import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { RiDeleteBinLine } from '@react-icons/all-files/ri/RiDeleteBinLine'
import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import { mutate } from 'swr'
import AlertNoData from '../AlertNoData'
import MeetingDeletePopup from './MeetingDeletePopup'
import MeetingEditPopup from './MeetingEditPopup'

function MeetingList(props:any) {
    const moment = require('moment')
    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)
    const [meeting, setMeeting] = useState('')

    function editHandler(meeting:any){
        setEdit(true)
        setMeeting(meeting)
    }

    function deleteHandler(meeting:any){
        setDel(true)
        setMeeting(meeting)
    }

    const refetchEdit = async () => {
        await mutate(props.endpoint)
        setEdit(false)
    }

    const refetchDel = async () => {
        await mutate(props.endpoint)
        setDel(false)
    }

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
                                    <div className='text-start mb-2 text-[19px] font-bold whitespace-pre-wrap break-word'>
                                        MEETING WITH {meeting.user.code} - {meeting.user.name.toUpperCase()}
                                    </div>
                                    <div className={`${meeting.status === 'Done' ? 'text-[#83d475]' : meeting.status === 'Pending' ? 'text-yellow' : 'text-red'}  items-center text-normal font-bold`}>
                                        {meeting.status}
                                    </div>
                                </div>
                                <div className='text-smalltext font-bold'>
                                    PIC:
                                </div>
                                <div className='text-justify text-smalltext whitespace-pre-wrap break-word mb-0.5'>
                                    { meeting.staff.name }
                                </div>
                                <div className='text-smalltext font-bold'>
                                    Time:
                                </div>
                                <div className='text-justify text-smalltext whitespace-pre-wrap break-word mb-0.5'>
                                    { moment(meeting.startTime).format('DD MMMM YYYY') } || { moment(meeting.startTime).format('hh:mm A') }
                                </div>
                                <div className='text-smalltext font-bold'>
                                    Location:
                                </div>
                                <div className='text-justify text-smalltext whitespace-pre-wrap break-word mb-8'>
                                    {meeting.location}
                                </div>
                                
                                <div className='text-smalltext font-bold'>
                                    Notes for user:
                                </div>
                                <div className='text-justify text-smalltext whitespace-pre-wrap break-word mb-0.5'>
                                    { meeting.description }
                                </div>
                                {
                                    getCookie('ROLE') === 'STAFF' ? 
                                    meeting.note !== null ? 
                                        <>
                                            <div className='flex flex-col'>
                                                <div className='text-smalltext font-bold'>
                                                    Notes for staff:
                                                </div>
                                                <div className='text-justify text-smalltext whitespace-pre-wrap break-word mb-2'>
                                                    { meeting.note }
                                                </div>
                                            </div>
                                            <div className='text-justify text-smalltext whitespace-pre-wrap break-word text-blue font-bold'>
                                                Press edit button to edit notes
                                            </div>
                                        </>
                                        :
                                        <div className='text-justify text-smalltext whitespace-pre-wrap break-word text-blue font-bold'>
                                            Press edit button to input notes
                                        </div>
                                    : <></>
                                }
                                {
                                    getCookie('ROLE') === 'STAFF' ? 
                                    <div className='text-end text-tinytext text-gray-400 mt-4'>
                                        Updated by { meeting.updatedByStaff != null ? meeting.updatedByStaff.name : 'Admin' } on { moment(meeting.lastUpdate).format('DD MMMM YYYY') }
                                    </div> : <></>
                                }
                                {
                                    getCookie('ROLE') === 'STAFF' ?
                                    <div className="text-end text-smalltext font-bold flex w-full justify-end mt-2">
                                        <div className='flex py-2 px-4 rounded bg-yellow items-center text-white mr-3 hover:cursor-pointer' onClick={() => editHandler(meeting)}>
                                            <FiEdit2 className='text-smalltitle mr-1.5' />
                                            Update
                                        </div>
                                        <div className='flex py-2 px-4 rounded bg-red items-center text-white hover:cursor-pointer' onClick={() => deleteHandler(meeting)}>
                                            <RiDeleteBinLine className='text-smalltitle mr-1.5' />
                                            Delete
                                        </div>
                                    </div> : <></>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                getCookie('ROLE') === 'STAFF' ? 
                <>
                    <MeetingEditPopup meeting={meeting} edit={edit} onClose={() => setEdit(false)} refetch={refetchEdit} /> 
                    <MeetingDeletePopup meeting={meeting} del={del} onClose={() => setDel(false)} refetch={refetchDel} />
                </> : <></>
            }
        </>
    )
}

export default MeetingList