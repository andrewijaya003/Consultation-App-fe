import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import { RiDeleteBinLine } from 'react-icons/ri'
import Popup from 'reactjs-popup'
import AlertError from '../AlertError'

function CardUserNote(props:any) {
    const [notes, setNotes] = useState(props.data)
    const [errorMsg, setErrorMsg] = useState('')
    const [popupDelete, setPopupDelete] = useState(false)

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
            }).then(res => res.json()).then(() => {
                props.fetchUserNoteData()
            })
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
            }).then(res => res.json()).then(() => {
                props.fetchUserNoteData()
            })
        }
    }

    useEffect(() => {
        setNotes(props.data.notes)
    }, [props.data])

    function confirmDelete(id:string) {
        deleteNotesHandler(id)
        setPopupDelete(false)
    }
    
    return (
        <>
            <div className='flex flex-col'>
                <label htmlFor='notes' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                    Notes <div className='text-red'>*</div>
                </label>
                <textarea value={notes} name='notes' id='notes' maxLength={500} rows={4} className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className='flex justify-end mt-2 mb-6'>
                <div className='relative w-full'>
                    <div className="text-end text-smalltext font-bold flex w-full justify-end mt-2">
                        <div className='flex py-2 px-4 rounded bg-yellow items-center text-white mr-3 hover:cursor-pointer' onClick={() => updateNotesHandler(props.data.id)}>
                            <FiEdit2 className='text-smalltitle mr-1.5' />
                            Edit
                        </div>
                        
                            <div className='flex py-2 px-4 rounded bg-red items-center text-white hover:cursor-pointer' onClick={() => setPopupDelete(true)} >
                                <RiDeleteBinLine className='text-smalltitle mr-1.5' />
                                Delete
                            </div>
                            {
                                popupDelete ?
                                <div className={`absolute -bottom-100 -right-100 z-30 w-fit text-smalltext font-bold px-3 py-2 bg-white border border-gray-300 shadow-sm rounded-md`}>
                                    <div className='px-3 py-2 w-full' >
                                        Are you sure want to delete this user note?
                                    </div>
                                    <div className='flex justify-center w-full'>
                                        <div className='text-white mr-2 flex w-full justify-center bg-blue px-3 py-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer' onClick={() => confirmDelete(props.data.id)} >
                                            Yes
                                        </div>
                                        <div className='flex justify-center w-full px-3 py-2 bg-white border border-gray-300 shadow-sm rounded-md hover:cursor-pointer' onClick={() => setPopupDelete(false)} >
                                            No
                                        </div>
                                    </div>
                                </div>
                                :
                                <></>
                            }
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