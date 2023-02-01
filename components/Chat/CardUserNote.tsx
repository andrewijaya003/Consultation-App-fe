import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import { RiDeleteBinLine } from 'react-icons/ri'
import AlertError from '../AlertError'

function CardUserNote(props:any) {
    const [notes, setNotes] = useState(props.data)
    const [errorMsg, setErrorMsg] = useState('')

    async function updateNotesHandler(id:string) {
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
                    id: id,
                    notes:notes
                })
            }).then(res => res.json()).then(props.userNoteMutate())
        }
    }

    async function deleteNotesHandler(id:string) {
        if(id === '' || id == undefined || id == null) {
            setErrorMsg('Notes not found')
        }

        if(notes !== '') {
            await fetch(process.env.BASE_URL + '/user-note', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'DELETE',
                body: JSON.stringify({
                    id: id
                })
            }).then(res => res.json()).then(props.userNoteMutate())
        }
    }

    useEffect(() => {
        setNotes(props.data.notes)
    }, [props.data])
    
    
    return (
        <>
            <div className='flex flex-col mb-6'>
                <label htmlFor='notes' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                    Notes <div className='text-red'>*</div>
                </label>
                <textarea value={notes} name='notes' id='notes' maxLength={500} rows={8} className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className='flex justify-end mt-2'>
                <div className="text-end text-smalltext font-bold flex w-full justify-end mt-2">
                    <div className='flex py-2 px-4 rounded bg-yellow items-center text-white mr-3 hover:cursor-pointer' onClick={() => updateNotesHandler(props.data.id)}>
                        <FiEdit2 className='text-smalltitle mr-1.5' />
                        Edit
                    </div>
                    <div className='flex py-2 px-4 rounded bg-red items-center text-white hover:cursor-pointer' onClick={() => deleteNotesHandler(props.data.id)}>
                        <RiDeleteBinLine className='text-smalltitle mr-1.5' />
                        Delete
                    </div>
                </div>
            </div>
            {
                errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
            }
        </>
    )
}

export default CardUserNote