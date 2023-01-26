import React, { useEffect, useMemo, useRef, useState } from 'react'
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

const fetcherUser = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function chat() {
    const container = document.querySelector('#header-container')
    const [endpointCategories, setEndpointCategories] = useState(process.env.BASE_URL+'/category')
    // const {data: rooms, mutate: mutateRooms} = useSWR(endpointRooms, () => fetcher)
    const [rooms, setRooms] = useState<Object[]>()
    const {data: categories, mutate: mutateCategories} = useSWR(endpointCategories, fetcherCategories)
    const [userId, setUserId] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [roomChatId, setRoomChatId] = useState('')
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('')
    const [bounceUsername] = useDebounce(username, 1000) 
    const [focusIdComponent, setFocusIdComponent] = useState('')
    const [extraTitle, setExtraTitle] = useState('')
    const {data:user, mutate:userMutate} = useSWR(process.env.BASE_URL + '/auth/me', fetcherUser)
    const [offsetRooms, setOffsetRooms] = useState(0)
    const [takeRooms, setTakeRooms] = useState(1)
    const [newRooms, setNewRooms] = useState([])
    const [isFetchMore, setIsFetchMore] = useState(false)
    const socket = useMemo<any>(()=>{
        if (!window) return;

        const socket = io('http://localhost:8000')

        return socket;
    }, [window])

    useEffect(()=>{
        return () => {
            socket.disconnect()
        }
    }, []);

    useEffect(() => {
        if(user){
            socket.emit('staff-online', {id: user?.id})
        }
    }, [user])

    container?.addEventListener('scroll', (e) => {
        if (container.clientHeight + container.scrollTop >= container.scrollHeight && rooms != undefined) {
            setIsFetchMore(true)
        }
    })

    useEffect(() => {
        console.log(newRooms)
        if(newRooms.length != 0 && rooms != undefined) {
            setRooms([...rooms, ...newRooms])
        } else {
            setIsFetchMore(false)
        }
    }, [newRooms])

    useEffect(() => {
        if(isFetchMore && rooms != undefined && offsetRooms != 0) {
            if(role == '' && categoryId == '' && bounceUsername == ''){
                console.log(offsetRooms+' a '+takeRooms)
                fetch(process.env.BASE_URL+'/room-chat/preview-all', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        offset: offsetRooms,
                        take: takeRooms
                    })
                }).then(res => res.json()).then((data) => {
                    setOffsetRooms(takeRooms)
                    setTakeRooms(takeRooms+1)
                    setNewRooms(data)
                })
                
            } else if(role != '') {
                console.log(offsetRooms+' b '+takeRooms)
                fetch(process.env.BASE_URL+'/room-chat/preview', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        role: role,
                        offset: offsetRooms,
                        take: takeRooms
                    })
                }).then(res => res.json()).then((data) => {
                    setOffsetRooms(takeRooms)
                    setTakeRooms(takeRooms+1)
                    setNewRooms(data)
                })
            } else if(categoryId != '') {
                console.log(offsetRooms+' c '+takeRooms)
                fetch(process.env.BASE_URL+'/room-chat/preview', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        categoryId: categoryId,
                        offset: offsetRooms,
                        take: takeRooms
                    })
                }).then(res => res.json()).then((data) => {
                    setOffsetRooms(takeRooms)
                    setTakeRooms(takeRooms+1)
                    setNewRooms(data)
                })
            } else {
                console.log(offsetRooms+' d '+takeRooms)
                fetch(process.env.BASE_URL+'/room-chat/preview', {
                    headers: {
                        'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        username: username,
                        offset: offsetRooms,
                        take: takeRooms
                    })
                }).then(res => res.json()).then((data) => {
                    setOffsetRooms(takeRooms)
                    setTakeRooms(takeRooms+1)
                    setNewRooms(data)
                })
            } 
        }
    }, [isFetchMore, offsetRooms, rooms])

    useEffect(() => {
        console.log(rooms)
        setIsFetchMore(false)
    }, [rooms])
    
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
        console.log('category')
        container?.scrollTo(top)
        setRooms(undefined)
        setOffsetRooms(0)
        setTakeRooms(1)
        setRole('')
        setUsername('')
        setCategoryId(data.id)
        setExtraTitle(data.category)
    }

    const handleRole = (data:string) => {
        console.log('role')
        container?.scrollTo(top)
        setRooms(undefined)
        setOffsetRooms(0)
        setTakeRooms(1)
        setCategoryId('')
        setUsername('')
        setRole(data)
        setExtraTitle(data)
    }
    
    const handleUsername = (data:string) => {
        console.log('username')
        container?.scrollTo(top)
        setRooms(undefined)
        setOffsetRooms(0)
        setTakeRooms(1)
        setRole('')
        setCategoryId('')
        setUsername(data)
        setExtraTitle(data)
    }

    const refetchRooms = async () => {
        console.log(offsetRooms+' e '+takeRooms)
        await fetch(process.env.BASE_URL+'/room-chat/preview-all', {
            headers: {
                'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                offset: 0,
                take: 1
            })
        }).then(res => res.json()).then(data => {
            setRooms(data)
            setOffsetRooms(1)
            setTakeRooms(2)
        })
    }

    const refetchRoomsFilter = async (role:string, categoryId:string, username:string) => {
        if(role != '') {
            console.log(offsetRooms+' f '+takeRooms)
            await fetch(process.env.BASE_URL+'/room-chat/preview', {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    role: role,
                    offset: 0,
                    take: 1
                })
            }).then(res => res.json()).then(data => {
                setRooms(data)
                setOffsetRooms(1)
                setTakeRooms(2)
            })
        } else if(categoryId != '') {
            console.log(offsetRooms+' g '+takeRooms)
            await fetch(process.env.BASE_URL+'/room-chat/preview', {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    categoryId: categoryId,
                    offset: 0,
                    take: 1
                })
            }).then(res => res.json()).then(data => {
                setRooms(data)
                setOffsetRooms(1)
                setTakeRooms(2)
            })
        } else {
            console.log(offsetRooms+' h '+takeRooms)
            await fetch(process.env.BASE_URL+'/room-chat/preview', {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    offset: 0,
                    take: 1
                })
            }).then(res => res.json()).then(data => {
                setRooms(data)
                setOffsetRooms(1)
                setTakeRooms(2)
            })
        }
    }

    useEffect(() => {
        if(offsetRooms == 0 && rooms == undefined) {
            console.log('filter')
            if(role == '' && categoryId == '' && bounceUsername == '') {
                refetchRooms()
            } else {
                resetHeaderChat()
                refetchRoomsFilter(role, categoryId, bounceUsername)
            }
        }
    }, [role, categoryId, bounceUsername, offsetRooms, rooms])

    function handleJoinRoomChat(header:Object) {
        socket.emit('staff-join-user-room', {userId: header.user?.id})
    }

    function handleJoinRoomChatFilter(header:Object) {
        setFocusIdComponent(header.lastChat.roomId)
        socket.emit('staff-join-user-room', {userId: header.user?.id})
    }

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
                        <div className='md:w-[350px] w-full h-full display-scrollbar' id='header-container'>
                            {
                                rooms == undefined ? 
                                <div className='flex w-full h-full justify-center items-center'>
                                    <ReactLoading type={'spin'} color={'#b4b4b4'} width={50} height={50} />
                                </div> : 
                                rooms.length != 0 ?
                                    !(rooms.length == 1 && rooms[0].lastChat == null) ?
                                        rooms.map((header:any) => (
                                            role == '' && categoryId == '' && bounceUsername == '' ?
                                            <div onClick={() => handleJoinRoomChat(header)}>
                                                <HeaderChat socket={socket} getChats={() => handleHeaderChat(header)} header={header} />
                                            </div>
                                            :
                                            <div onClick={() => handleJoinRoomChatFilter(header)} >
                                                <HeaderChat socket={socket} getChats={() => handleHeaderChat(header)} header={header} />
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
                        <StaffChat socket={socket} userId={userId} focusIdComponent={focusIdComponent} roomChatId={roomChatId} resetUserId={() => resetHeaderChat()} />
                    }
                </div>
            </div>
        </div>
    )
}

export default chat