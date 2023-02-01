import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import { RiDeleteBinLine } from 'react-icons/ri'
import useSWR from 'swr'
import AlertError from '../AlertError'
import AlertLoading from '../AlertLoading'
import PageTitle2 from '../PageTitle2'
import CardUserNote from './CardUserNote'

function UserNotes(props:any) {
    const [notes, setNotes] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [endpointUserNote, setEndpointUserNote] = useState(process.env.BASE_URL + '/user-note/user-notes-by-user')
    const [fetchUserNote, setFetchUserNote] = useState(
        fetch(endpointUserNote, {
            headers : { 
                'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                userId:props.userId
            })
        }).then(res => res.json())
    )
    const {data:userNoteData, mutate:userNoteMutate} = useSWR(endpointUserNote, () => fetchUserNote)
    

    async function addNotesHandler() {
        if(notes === '') {
            setErrorMsg('Notes must be filled')
        }

        if(notes !== '') {
            await fetch(process.env.BASE_URL + '/user-note', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    userId:props.userId,
                    notes:notes
                })
            }).then(res => res.json()).then((data) => {
                console.log(data)
                userNoteMutate([...userNoteData, data])
                setNotes('')
            })
        }
    }

    useEffect(() => {
        setFetchUserNote(
            fetch(endpointUserNote, {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    userId:props.userId
                })
            }).then(res => res.json())
        )
        console.log(props.userId)
        console.log(userNoteData)
    }, [props.userId])
    
    return (
        props.userNotes ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <PageTitle2 title='Insert User Notes' sectitle='user notes' />
                <div className='flex flex-col my-6'>
                    <label htmlFor='notes' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                        New user notes <div className='text-red'>*</div>
                    </label>
                    <textarea name='notes' id='notes' maxLength={500} rows={8} className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div className='flex w-full justify-end'>
                    <input type="button" value='Insert' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={addNotesHandler} />
                </div>
                <div className='h-px bg-secblack my-2' />
                <div className='flex flex-col mt-6 pr-2 h-[420px] display-scrollbar'>
                    {
                        userNoteData ?
                        userNoteData.map((data:any) => (
                            <CardUserNote data={data} userNoteMutate={userNoteMutate} />
                        ))
                        :
                        <AlertLoading title="user notes" />
                    }
                </div>
            </div>
        </div>
        :
        <></>
    )
}

export default UserNotes