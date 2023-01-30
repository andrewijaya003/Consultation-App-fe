import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import AlertError from '../AlertError'
import PageTitle2 from '../PageTitle2'

const fetcher = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function UserNotes(props:any) {
    const [notes, setNotes] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [userNoteData, setUserNoteData] = useState([])
    // useSWR(process.env.BASE_URL + '/user-note/user-notes-by-user', () => {
    //     fetch(process.env.BASE_URL + '/user-note/user-notes-by-user', {
    //         headers : { 
    //             'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
    //             'Content-type': 'application/json'
    //         },
    //         method: 'POST',
    //         body: JSON.stringify({
    //             userId:props.userId
    //         })
    //     }).then(res => res.json())
    // }) 

    useEffect(() => {
        setErrorMsg('')
    }, [props.userNotes])
    

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
            }).then(res => res.json()).then(props.onClose())
        }
    }

    async function updateNotesHandler() {
        if(notes === '') {
            setErrorMsg('Notes must be filled')
        }

        if(notes !== '') {
            await fetch(process.env.BASE_URL + '/user-note', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({
                    id:userNoteData[0].id,
                    notes:notes
                })
            }).then(res => res.json()).then(props.onClose())
        }
    }

    useEffect(() => {
        console.log(userNoteData)
        if(userNoteData != undefined) {
            if(userNoteData.length != 0) {
                setNotes(userNoteData[0].notes)
            }
        }
    }, [userNoteData])

    useEffect(() => {
        if(props.userId != '') {
            fetch(process.env.BASE_URL + '/user-note/user-notes-by-user', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    userId:props.userId
                })
            }).then(res => res.json()).then(data => setUserNoteData(data)).catch(err => console.log(err))
        }
    }, [props.userId])
    
    return (
        props.userNotes ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <PageTitle2 title='Insert User Notes' sectitle='user notes' />
                <form className='flex flex-col mt-6'>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='notes' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Notes <div className='text-red'>*</div>
                        </label>
                        <textarea value={notes} name='notes' id='notes' maxLength='500' rows="8" className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setNotes(e.target.value)} />
                    </div>
                    <div className='h-px bg-secblack my-2' />
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2'>
                        {
                            userNoteData.length != 0 ?
                            <input type="button" value='Update' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={updateNotesHandler} />
                            :
                            <input type="button" value='Insert' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={addNotesHandler} />
                        }
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default UserNotes