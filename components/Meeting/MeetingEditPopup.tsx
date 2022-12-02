import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AlertError from '../AlertError'
import LabelInput from '../LabelInput'
import PageTitle2 from '../PageTitle2'

function MeetingEditPopup(props:any) {
    const moment = require('moment')
    const [studentId, setStudentId] = useState('')
    const [code, setCode] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [description, setDescription] = useState('')
    const [notes, setNotes] = useState(null)
    const [status, setStatus] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    useEffect(() => {
        console.log(props.meeting)
        if(props.meeting !== undefined) {
            if(props.meeting.user !== undefined) {
                setStudentId(props.meeting.user.code)
            }
            setDate(moment(props.meeting.startTime).format('YYYY-MM-DD'))
            setTime(moment(props.meeting.startTime).format('HH:mm'))
            setDescription(props.meeting.description)
            setNotes(props.meeting.note)
            setStatus(props.meeting.status)
        }
    }, [props.meeting])

    useEffect(() => {
        if(studentId.startsWith('BN')) {
            fetch(process.env.BASE_URL + '/user/get-user', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    binusianId: studentId
                })
            }).then(res => res.json()).then(data => setCode(data.id))
        } else {
            fetch(process.env.BASE_URL + '/user/get-user', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    nim: studentId
                })
            }).then(res => res.json()).then(data => setCode(data.id))
        }
    }, [studentId])

    async function editMeetingHandler() {
        if(code === undefined) {
            setErrorMsg('Student ID not found')
        } else if(date === '') {
            setErrorMsg('Date must be filled')
        } else if(time === '') {
            setErrorMsg('Time must be filled')
        } else if(description === '') {
            setErrorMsg('Description must be filled')
        }

        if(studentId !== '' && code !== undefined && date !== '' && time !== '' && description !== '' && notes !== '') {
            await fetch(process.env.BASE_URL + '/meeting', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({
                    id: props.meeting.id,
                    date: date,
                    time: time,
                    description: description,
                    note: notes,
                    status: status.toUpperCase()
                })
            }).then(res => res.json()).then(() => router.reload())
        } else if(studentId !== '' && code !== undefined && date !== '' && time !== '' && description !== '' && notes === '') {
            await fetch(process.env.BASE_URL + '/meeting', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({
                    id: props.meeting.id,
                    date: date,
                    time: time,
                    description: description,
                    note: null,
                    status: status.toUpperCase()
                })
            }).then(res => res.json()).then(() => router.reload())
        }
        
        
    }

    return (
        props.edit ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <PageTitle2 title='Edit Meeting' sectitle='meeting' />
                <form className='flex flex-col mt-6'>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='studentId' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Student ID <div className='text-red'>*</div>
                        </label>
                        <input value={studentId} name='studentId' id='studentId' type='studentId' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setStudentId(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='date' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Date <div className='text-red'>*</div>
                        </label>
                        <input value={date} name='date' id='date' type='date' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setDate(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='time' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Time <div className='text-red'>*</div>
                        </label>
                        <input value={time} name='time' id='time' type='time' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setTime(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Description <div className='text-red'>*</div>
                        </label>
                        <input value={description} name='description' id='description' type='text' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setDescription(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Notes <div className='text-red'></div>
                        </label>
                        <textarea value={notes} name='description' id='description' maxLength='500' rows="8" className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' onChange={(e) => setNotes(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor="status" className="text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1">
                            Status <div className='text-red'>*</div>
                        </label>
                        <select id="status" className="border border-gray-300 rounded-md px-1.5 py-2 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext" required onChange={(e) => setStatus(e.target.value)} value={status} >
                            <option value="Pending">Pending</option>
                            <option value="Canceled">Canceled</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                    <div className='h-px bg-secblack my-2' />
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2'>
                        <input type="button" value='Edit' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={editMeetingHandler} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default MeetingEditPopup