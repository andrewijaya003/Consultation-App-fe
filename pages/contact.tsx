import React, { useEffect, useMemo, useState } from 'react'
import {BsFillInfoCircleFill} from '@react-icons/all-files/bs/BsFillInfoCircleFill'
import {ImCross} from '@react-icons/all-files/im/ImCross'
import {BiChevronDown} from '@react-icons/all-files/bi/BiChevronDown'
import { getCookie } from 'cookies-next'
import FAQList from '../components/FAQ/FAQList'
import AlertLoading from '../components/AlertLoading'
import AlertNoData from '../components/AlertNoData'
import AlertError from '../components/AlertError'
import UserChat from '../components/Chat/UserChat'
import useSWR from 'swr'
import { io } from 'socket.io-client'

function contact() {
    const [infoCategory, setInfoCategory] = useState(true)
    const [showDP, setShowDP] = useState(false)
    const [category, setCategory] = useState()
    const [categories, setCategories] = useState([])
    const [loadingCategory, setLoadingCategory] = useState(true)
    const [infoFAQ, setInfoFAQ] = useState(true)
    const [faqs, setFAQS] = useState([])
    const [loadingFAQ, setLoadingFAQ] = useState(true)
    const [chatUs, setChatUs] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [ratingStatus, setRatingStatus] = useState(true)
    const [endpointRoomChat, setEndpointRoomChat] = useState(process.env.BASE_URL+'/room-chat/user-not-rated-chat')
    const {data: roomChat, mutate: mutateRoomChat} = useSWR(endpointRoomChat, () => fetch(endpointRoomChat, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
            'Content-type': 'application/json'
        },
        method: 'POST',
    }).then(
        res => res.json()
    ))
    const [roomChatData, setRoomChatData] = useState()

    const fetchCategory = async () => fetch(process.env.BASE_URL+'/category', {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(
        res => res.json()
    ).then(data => {
        setCategories(data)
        setLoadingCategory(false)
    })

    useEffect(() => {
        setInfoCategory(true)
        setLoadingCategory(true)
        fetchCategory()
    }, [])

    function categoryHandler(value:any) {
        setErrorMsg('')
        setCategory(value)
        setShowDP(!showDP)
    }

    useEffect(() => {
        if(category !== undefined) {
            setLoadingFAQ(true)
            fetch(process.env.BASE_URL+'/faq/faq-by-category/'+category.id, {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    'Content-type': 'application/json'
                },
                method: 'GET',
            }).then(
                res => res.json()
            ).then(data => {
                setFAQS(data)
                setLoadingFAQ(false)
            })
        }
    }, [category])

    async function chatUsHandler() {
        if(category !== undefined) {
            await fetch(process.env.BASE_URL+'/room-chat', {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    categoryId: category.id
                })
            }).then(
                res => res.json()
            ).then(async data => {
                setChatUs(true)
                setRoomChatData(data)
                setErrorMsg('')
            }).catch(e => console.log(e))
        } else {
            setErrorMsg('Category must be selected')
        }
    }

    useEffect(() => {
        console.log(roomChat)
        setRoomChatData(roomChat)
    }, [roomChat])

    useEffect(() => {
        console.log(roomChatData)
        setRoomChatData(roomChatData)
    }, [roomChatData])

    return (
        <div className='max-w-screen-xl w-full px-4 py-5 flex flex-col ml-auto mr-auto'>
            <div className='flex flex-col w-full text-secblack mb-3'>
                <div className='flex flex-wrap w-full justify-between items-center'>
                    <div className='flex flex-col'>
                        <div className='text-normaltitle font-bold'>
                            Contact Us
                        </div>
                        <div className='h-0.5 bg-secblack my-2'></div>
                    </div>
                    {
                        roomChatData != undefined && category != undefined || roomChatData != undefined && category == undefined || 
                        roomChatData == undefined && category == undefined ?
                        <></> :
                        <div className='flex justify-end'>
                            <input type="button" value='Chat Us' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={() => chatUsHandler()} />
                        </div>
                    }
                </div>
            </div>
            {
                roomChatData != undefined ?
                <UserChat mutateRoomChat={mutateRoomChat} resetRoomChatData={() => setRoomChatData(undefined)} roomChatId={roomChatData.id} />
                :
                <div className="w-full flex flex-col">
                    {
                        loadingCategory ? <AlertLoading title='FAQS' /> :
                        <>
                            {
                                infoCategory ? 
                                <>
                                    <div className='flex w-full rounded-lg px-3.5 py-3 bg-white shadow-xm bg-[#bfdbfe] mb-6'>
                                        <div className='text-[#2196f3] mr-3 text-normaltitle hover:cursor-pointer'>
                                            <BsFillInfoCircleFill />
                                        </div>
                                        <div className='flex justify-between items-center w-full'>
                                            <div className='text-[#1e40af] text-smalltext font-bold'>
                                                Please choose your chat category
                                            </div>
                                            <ImCross size={10} color='#1e40af' className='hover:cursor-pointer' onClick={() => setInfoCategory(false)} />
                                        </div>
                                    </div>
                                </>
                                : <></>
                            }
                            <div className='flex flex-col w-full'>
                                <div className='flex flex-col mb-6'>
                                    <label htmlFor="category" className="text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1">
                                        Categories <div className='text-red'>*</div>
                                    </label>
                                    <div id='category' className='relative text-smalltext'>
                                        <div className={`flex items-center justify-between border border-gray-300 rounded-md px-1.5 py-2 outline-0 shadow-sm ${showDP ? 'ring-1 border-blue' : ''} hover:cursor-pointer`} onClick={() => setShowDP(!showDP)}>
                                            <div className='px-1.5'>
                                                {category === undefined || category === null || category === '' ? 'Choose category' : category.category}
                                            </div>
                                            <BiChevronDown size={23} />
                                        </div>
                                        <div className={`${showDP ? 'absolute' : 'hidden'} w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer z-2 bg-white`}>
                                            {
                                                categories.map((data:any) => (
                                                    <div className='hover:bg-gray-300 px-3 py-2' onClick={() => categoryHandler(data)}>
                                                        {data.category}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                                }
                                {
                                    category !== undefined ?
                                    <div className='flex flex-col'>
                                        {
                                            infoFAQ ? 
                                            <div className='flex w-full rounded-lg px-3.5 py-3 bg-white shadow-xm bg-[#bfdbfe] mb-6'>
                                                <div className='text-[#2196f3] mr-3 text-normaltitle hover:cursor-pointer'>
                                                    <BsFillInfoCircleFill />
                                                </div>
                                                <div className='flex justify-between items-center w-full'>
                                                    <div className='flex flex-col w-full'>
                                                        <div className='text-[#1e40af] text-smalltext font-bold'>
                                                            Frequently ask question about {category.category}
                                                        </div>
                                                        <div className='text-tinytext text-[#1e40af]'>
                                                            Please click chat us if the problem isn't solved.
                                                        </div>
                                                    </div>
                                                    <ImCross size={10} color='#1e40af' className='hover:cursor-pointer' onClick={() => setInfoFAQ(false)} />
                                                </div>
                                            </div> : <></>
                                        }
                                        {
                                            loadingFAQ ? 
                                            <AlertLoading title='FAQS' />
                                            : 
                                                faqs.length === 0 ? 
                                                <AlertNoData title='FAQ' />
                                                :
                                                faqs.map((faq:any) => (
                                                    <div className='flex flex-col border border-gray-300 rounded-lg px-3.5 py-3 mb-6 bg-white shadow-xm'>
                                                        <div className='text-smalltext font-bold mb-0.5'>
                                                            Problem:
                                                        </div>
                                                        <div className='text-normal whitespace-pre-wrap break-word'>
                                                            { faq.problem }
                                                        </div>
                                                        <div className='text-smalltext font-bold mt-2.5 mb-0.5'>
                                                            Solution:
                                                        </div>
                                                        <div className='text-normal whitespace-pre-wrap break-word'>
                                                            { faq.solution }
                                                        </div>
                                                    </div>
                                                ))
                                        }
                                    </div> : <></>
                                }
                            </div>
                        </>
                    }
                    
                </div>
            }
        </div>
    )
}

export default contact