import React, { useEffect, useRef, useState } from 'react'
import { BsFillChatDotsFill } from "@react-icons/all-files/bs/BsFillChatDotsFill";
import {BiCategoryAlt} from "react-icons/bi";
import {IoIosArrowBack} from "react-icons/io";
import HeaderChat from '../components/Chat/HeaderChat';
import useSWR from 'swr';
import { getCookie } from 'cookies-next';
import ReactLoading from 'react-loading';
import StaffChat from '../components/Chat/StaffChat';
import Popup from 'reactjs-popup';
import io from "socket.io-client";
import { useDebounce } from 'use-debounce';

const fetcherRooms = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

const fetcherCategories = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function chat() {
    const [search, setSearch] = useState('')
    const [more, setMore] = useState(false)
    const [endpointRooms, setEndpointRooms] = useState(process.env.BASE_URL+'/room-chat/preview-all')
    const [endpointCategories, setEndpointCategories] = useState(process.env.BASE_URL+'/category')
    const {data: rooms, mutate: mutateRooms} = useSWR(endpointRooms, () => fetcher)
    const {data: categories, mutate: mutateCategories} = useSWR(endpointCategories, fetcherCategories)
    const [userId, setUserId] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [roomChatId, setRoomChatId] = useState('')
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('')
    const [bounceUsername] = useDebounce(username, 1000) 
    const [fetcher, setFetcher] = useState()
    const [focusIdComponent, setFocusIdComponent] = useState('')
    const [extraTitle, setExtraTitle] = useState('')

    useEffect(() => {
        const data = fetch(process.env.BASE_URL+'/room-chat/preview-all', {
            headers: {
                'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN')
            },
            method: 'GET',
        }).then(res => res.json())

        setFetcher(data)
    }, [])

    useEffect(() => {
        mutateRooms()
    }, [fetcher])
    
    const handleHeaderChat = (data:any) => {
        setUserId('')
        setRoomChatId('')
        setUserId(data.user?.id)
        if(role == '' && categoryId == '' && bounceUsername == '') {
            setRoomChatId(data.lastChat.roomId)
        } else {
            setRoomChatId(data.lastRoomChatId)
        }
    }

    const resetHeaderChat = () => {
        setUserId('')
        setRoomChatId('')
    }

    const handleCategory = (data:any) => {
        setRole('')
        setUsername('')
        setCategoryId(data.id)
        setExtraTitle(data.category)
    }

    const handleRole = (role:string) => {
        setCategoryId('')
        setUsername('')
        setRole(role)
        setExtraTitle(role)
    }
    
    const handleUsername = (username:string) => {
        setRole('')
        setCategoryId('')
        setUsername(username)
        setExtraTitle(username)
    }

    const refetchRooms = async () => {
        const data = await fetch(process.env.BASE_URL+'/room-chat/preview-all', {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN')
                },
                method: 'GET',
            }).then(res => res.json()
        )
        
        setFetcher(data)
    }

    const refetchRoomsFilter = async (role:string, categoryId:string, username:string) => {
        if(role != '') {
            const data = await fetch(process.env.BASE_URL+'/room-chat/preview', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        role: role
                    })
                }).then(res => res.json()
            )
            
            setFetcher(data)
        } else if(categoryId != '') {
            const data = await fetch(process.env.BASE_URL+'/room-chat/preview', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        categoryId: categoryId
                    })
                }).then(res => res.json()
            )
            
            setFetcher(data)
        } else {
            const data = await fetch(process.env.BASE_URL+'/room-chat/preview', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        username: username
                    })
                }).then(res => res.json()
            )
            
            setFetcher(data)
        }
    }

    useEffect(() => {
        if(role == '' && categoryId == '' && bounceUsername == '') {
            refetchRooms()
        } else {
            resetHeaderChat()
            refetchRoomsFilter(role, categoryId, bounceUsername)
        }
    }, [role, categoryId, bounceUsername])

    useEffect(() => {
        console.log(rooms)
    }, [rooms])

    return (
        <div className='max-w-screen-xl w-full px-4 py-5 flex flex-col ml-auto mr-auto'>
            <div className='flex flex-col w-full text-secblack'>
                <div className='flex flex-wrap w-full justify-between items-center'>
                    <div className='flex flex-col'>
                        <div className='text-normaltitle font-bold'>
                            Chat {' '+extraTitle}
                        </div>
                        <div className='h-0.5 bg-secblack my-2'></div>
                    </div>
                </div>
            </div>
            <div className={`flex w-full mt-3 h-[600px]`}>
                {/* left section */}
                <div className={`${userId == '' ? 'flex' : 'hidden'} lg:flex w-full lg:w-fit flex-col h-full border border-gray-300`}>
                    <div className='flex w-full h-[40px] border-b border-gray-300 text-smalltext font-bold items-center'>
                        <div className='px-4 hover:text-blue hover:cursor-pointer' onClick={() => handleRole('')}>
                            All
                        </div>
                        <div className='px-4 hover:text-blue hover:cursor-pointer' onClick={() => handleRole('Student')}>
                            Student
                        </div>
                        <div className='px-4 hover:text-blue hover:cursor-pointer' onClick={() => handleRole('FS')}>
                            FS
                        </div>
                        <div className='px-4 hover:text-blue hover:cursor-pointer' onClick={() => handleRole('SS')}>
                            SS
                        </div>
                    </div>
                    <div className='flex flex-col w-full h-[560px] lg:max-w-sm'>
                        <div className='flex justify-between items-center w-full px-4 py-3'>
                            <input type="text" className='mr-2 px-2.5 py-2 w-full text-smalltext text-gray-900 bg-gray-200 rounded-md appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer' placeholder='Search users' onChange={(e) => handleUsername(e.target.value)} value={username} />
                            <Popup trigger={
                                <div>
                                    <BiCategoryAlt size={23} className='hover:cursor-pointer' />
                                </div>
                            } position="bottom left"
                            closeOnDocumentClick>
                                <div className={`flex flex-col w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer bg-white`} >
                                {
                                    categories ?
                                    categories.map((category:any) => (
                                        <div className='hover:bg-gray-100 px-3 py-2' onClick={() => handleCategory(category)} >
                                            {category.category}
                                        </div>
                                    )) : <></>
                                }
                                </div> 
                            </Popup>
                        </div>
                        <div className='md:w-[350px] w-full h-full display-scrollbar'>
                            {
                                !rooms ? 
                                <div className='flex w-full h-full justify-center items-center'>
                                    <ReactLoading type={'spin'} color={'#b4b4b4'} width={50} height={50} />
                                </div> : 
                                rooms.length != 0 ?
                                    !(rooms.length == 1 && rooms[0].lastChat == null) ?
                                    rooms.map((header:any) => (
                                        role == '' && categoryId == '' && bounceUsername == '' ?
                                        <HeaderChat getChats={() => handleHeaderChat(header)} header={header} />
                                        :
                                        <div onClick={() => setFocusIdComponent(header.lastChat.roomId)} >
                                            <HeaderChat getChats={() => handleHeaderChat(header)} header={header} />
                                        </div>
                                    )) 
                                    :
                                    <div className='px-4 py-3 flex justify-center items-center w-full h-full text-smalltext text-gray-400'>
                                        No chat found.
                                    </div> 
                                :
                                <div className='px-4 py-3 flex justify-center items-center w-full h-full text-smalltext text-gray-400'>
                                    No chat found.
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {/* right section */}
                <div className={`${userId != '' ? 'flex' : 'hidden'} h-full lg:flex lg:flex-col ${userId == '' ? 'lg:border lg:border-gray-300' : ''} w-full`}>
                    {
                        userId == '' ?
                        <div className='flex flex-col justify-center items-center h-full w-full'>
                            <BsFillChatDotsFill color='rgb(156 163 175)' size={90} />
                            <div className='text-smalltext text-gray-400 mt-5'>
                                Start a new conversation!
                            </div>
                        </div> :
                        <StaffChat userId={userId} focusIdComponent={focusIdComponent} roomChatId={roomChatId} endpointRooms={endpointRooms} resetUserId={() => resetHeaderChat()} />
                    }
                </div>
            </div>
        </div>
    )
}

export default chat