import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { MultiSelect } from 'react-multi-select-component'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'
import AlertError from '../AlertError'
import PageTitle2 from '../PageTitle2'

const fetcherStaffs = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function MeetingAddPopup(props:any) {
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [endpointStaffs, setEnpointStaffs] = useState(process.env.BASE_URL + '/staff')
    const {data:staffs, mutate:staffsMutate} = useSWR(endpointStaffs, fetcherStaffs)
    const [pic, setPic] = useState()
    const [showDP, setShowDP] = useState(false)

    useEffect(() => {
        setErrorMsg('')
    }, [props.add])

    async function addMeetingHandler() {
        if(email === '') {
            setErrorMsg('Email must be filled')
        } else if(date === '') {
            setErrorMsg('Date must be filled')
        } else if(time === '') {
            setErrorMsg('Time must be filled')
        } else if(description === '') {
            setErrorMsg('Notes for student must be filled')
        } else if(pic == undefined) {
            setErrorMsg('PIC must be filled')
        } else if(location == '') {
            setErrorMsg('Location must be filled')
        }

        if(email !== '' && date !== '' && time !== '' && description !== '') {
            const data = await fetch(process.env.BASE_URL + '/meeting', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    userEmail: email,
                    date: date,
                    time: time,
                    description: description,
                    location: location,
                    picId: pic.id
                })
            }).then(res => res.json())
            
            if(data?.statusCode > 399) {
                setErrorMsg(data.message)
            } else {
                await props.refetch()
            }
        }
    }

    function picIdHandler(value:any) {
        setPic(value)
        setShowDP(!showDP)
    }

    return (
        props.add ?
        <div className='fixed top-0 left-0 w-full h-full max-h-screen flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md ' onClick={(e) => e.stopPropagation()}>
                <div className='px-4'>
                    <PageTitle2 title='Insert Meeting' sectitle='meeting' />
                </div>
                <form className='flex flex-col mt-6 max-h-[420px] display-scrollbar px-4'>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='email' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Email <div className='text-red'>*</div>
                        </label>
                        <input name='email' id='email' type='email' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setEmail(e.target.value)} /> 
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
                            Notes for student <div className='text-red'>*</div>
                        </label>
                        <textarea name='description' id='description' rows={8} className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='location' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Location <div className='text-red'>*</div>
                        </label>
                        <input name='location' id='location' type='text' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setLocation(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor="category" className="text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1">
                            PIC <div className='text-red'>*</div>
                        </label>
                        <div id='category' className='relative text-smalltext'>
                            <div className={`flex items-center justify-between border border-gray-300 rounded-md px-1.5 py-2 outline-0 shadow-sm ${showDP ? 'ring-1 border-blue' : ''} hover:cursor-pointer`} onClick={() => setShowDP(!showDP)}>
                                <div className='px-1.5'>
                                    {pic === undefined ? 'Choose staff' : pic.name}
                                </div>
                                <BiChevronDown size={23} />
                            </div>
                            <div className={`${showDP ? 'absolute' : 'hidden'} w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer z-2 bg-white`}>
                                {
                                    staffs ? 
                                    staffs.map((staff:any) => (
                                        <div className='hover:bg-gray-300 px-3 py-2' onClick={() => picIdHandler(staff)}>
                                            {staff.name}
                                        </div>    
                                    ))
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2 border-t-2 border-secblack'>
                        <input type="button" value='Insert' className='bg-blue mt-2 text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={addMeetingHandler} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default MeetingAddPopup