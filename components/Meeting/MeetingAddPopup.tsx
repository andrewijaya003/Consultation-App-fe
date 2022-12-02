import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AlertError from '../AlertError'
import PageTitle2 from '../PageTitle2'

function MeetingAddPopup(props:any) {
    const [studentId, setstudentId] = useState('')
    const [code, setCode] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [description, setDescription] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

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
            }).then(res => res.json()).then(data => setCode(data.id)).catch(err => console.log(err))
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
            }).then(res => res.json()).then(data => setCode(data.id)).catch(err => console.log(err))
        }
    }, [studentId])

    async function addMeetingHandler() {
        if(code === undefined) {
            setErrorMsg('Student ID not found')
        } else if(date === '') {
            setErrorMsg('Date must be filled')
        } else if(time === '') {
            setErrorMsg('Time must be filled')
        } else if(description === '') {
            setErrorMsg('Description must be filled')
        }

        if(studentId !== '' && code !== undefined && date !== '' && time !== '' && description !== '') {
            await fetch(process.env.BASE_URL + '/meeting', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    userId: code,
                    date: date,
                    time: time,
                    description: description
                })
            }).then(res => res.json()).then(() => router.reload())
        }

        
    }

    return (
        props.add ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <PageTitle2 title='New Meeting' sectitle='meeting' />
                <form className='flex flex-col mt-6'>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='studentId' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Student ID <div className='text-red'>*</div>
                        </label>
                        <input name='studentId' id='studentId' type='studentId' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setstudentId(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='date' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Date <div className='text-red'>*</div>
                        </label>
                        <input name='date' id='date' type='date' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setDate(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='time' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Time <div className='text-red'>*</div>
                        </label>
                        <input name='time' id='time' type='time' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setTime(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Description <div className='text-red'>*</div>
                        </label>
                        <input name='description' id='description' type='text' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setDescription(e.target.value)} /> 
                    </div>
                    <div className='h-px bg-secblack my-2' />
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2'>
                        <input type="button" value='Create' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={addMeetingHandler} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default MeetingAddPopup