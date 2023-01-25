import React, { useEffect, useRef, useState } from 'react'
import { ImAttachment } from "@react-icons/all-files/im/ImAttachment";
import {IoIosArrowBack, IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import FilePopup from './FilePopup';
import { getCookie } from 'cookies-next';
import useSWR, { mutate } from 'swr';
import ReactLoading from 'react-loading';
import { useDebounce } from 'use-debounce';
import StaffMessage from './StaffMessage';
import {io} from 'socket.io-client'
import ResolveChat from './ResolveChat';
import InfiniteScroll from 'react-infinite-scroll-component'

const fetcher = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function UserChat(props:any) {
    const [files, setFiles] = useState([])
    const [fixFiles, setFixFiles] = useState([])
    const [message, setMessage] = useState('')
    const [shift, setShift] = useState(false)
    const [userId, setUserId] = useState('')
    const [roomChatId, setRoomChatId] = useState('')
    const [endpointRooms, setEndpointRooms] = useState(process.env.BASE_URL+'/room-chat/room-chats-by-user/'+props.userId)
    const {data: rooms, mutate: mutateRooms} = useSWR(endpointRooms, fetcher)
    const socket = io('http://localhost:8000', { transports: ['websocket', 'polling', 'flashsocket'] })
    const [resolve, setResolve] = useState(false)
    const [searchChat, setSearchChat] = useState('')
    const [bounceSearchChat] = useDebounce(searchChat, 1000)
    const [searchChatData, setSearchChatData] = useState([])
    const [indexChat, setIndexChat] = useState(0)

    socket.on('receive-message', ((roomId, message) => (
        console.log(roomId+' '+message)
        // mutateRooms()
    )))

    useEffect(() => {
        console.log(props.focusIdComponent)
        document.getElementById(props.focusIdComponent)?.scrollIntoView()
    }, [props.focusIdComponent])

    useEffect(() => {
        if(files.length != 0 ) {
            let list = []
            for(let i = 0; i < files.length; i++) {
                list.push(URL.createObjectURL(files[i]))
            }
            setFixFiles(list)
        }
    }, [files])

    const onClose = async () => {
        await mutateRooms()
        setFiles([])
        setFixFiles([])
    }

    function handleEnterDown(e:any) {
        if(e.key == 'Shift') {
            setShift(true)
        }
    }

    async function handleEnterUp(e:any) {
        if(e.key == 'Shift') {
            setShift(false)
        }
        if(e.key == 'Enter' && !shift && message.trim() != '') {
            let sendChat = new FormData()
            sendChat.append('roomId', roomChatId)
            sendChat.append('message', message)

            const data:any = await fetch(process.env.BASE_URL + '/chat', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                },
                method: 'POST',
                body: sendChat
            }).then((res) => res.json())

            socket.emit('message', roomChatId, data)
            // mutateRooms()

            setMessage('')
        } else if(e.key == 'Enter' && !shift ) {
            setMessage('')
        } 
    }

    useEffect(() => {
        setUserId(props.userId)
        setRoomChatId(props.roomChatId)
        setEndpointRooms(process.env.BASE_URL+'/room-chat/room-chats-by-user/'+props.userId)
        setSearchChat('')
    }, [props.userId, props.roomChatId])
    
    useEffect(() => {
        if(rooms) {
            document.getElementById(props.focusIdComponent)?.scrollIntoView()
        }
        console.log(rooms)
    }, [rooms])

    useEffect(() => {
        console.log('userid '+props.userId)
        console.log('roomchati '+props.roomChatId)
    }, [])

    useEffect(() => {
        console.log(endpointRooms)
    }, [endpointRooms])

    useEffect(() => {
        console.log(roomChatId)
        console.log(bounceSearchChat)
        if(bounceSearchChat != '') {
            fetch(process.env.BASE_URL + '/chat/search', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    // roomChatId: roomChatId,
                    message: bounceSearchChat
                })
            }).then((res) => res.json()).then((data) => setSearchChatData(data))
        } else {
            setSearchChatData([])
        }
    }, [bounceSearchChat])

    useEffect(() => {
        console.log(searchChatData)
        setIndexChat(searchChatData.length-1)
        document.getElementById(searchChatData[indexChat]?.id)?.scrollIntoView()
    }, [searchChatData])

    function handleArrowChat(value:number) {
        if(value < 0) {
            setIndexChat(0)
        } else if(value == searchChatData.length) {
            setIndexChat(value-1)
        } else {
            setIndexChat(value)
        }
    }

    useEffect(() => {
        // console.log(indexChat)
        console.log(searchChatData[indexChat])
        document.getElementById(searchChatData[indexChat]?.id)?.scrollIntoView()
    }, [indexChat])


    
    return (
        <>
            <div className='h-[600px] flex flex-col border border-gray-300 w-full'>    
                <div className='flex w-full p-4 justify-center items-center border-b border-gray-300'>
                    <IoIosArrowBack size={25} onClick={props.resetUserId} className={`hover:cursor-pointer`} />
                    <input value={searchChat} type="text" className='w-full px-2.5 py-2 mx-2 text-smalltext text-gray-900 bg-gray-200 rounded-md appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer' placeholder='Search chats' onChange={(e) => setSearchChat(e.target.value)} />
                    {
                        searchChatData.length != 0 ?
                        <div className='flex flex-col mr-2'>
                            <IoIosArrowUp size={18} className={`hover:cursor-pointer`} onClick={() => handleArrowChat(indexChat-1)} />
                            <IoIosArrowDown size={18} className={`hover:cursor-pointer`} onClick={() => handleArrowChat(indexChat+1)} />
                        </div>
                        :
                        <></>
                    }
                    {
                        rooms && rooms[0].status == 'Pending' ? 
                        <input type="submit" value='End' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={() => setResolve(true)} />
                        :
                        <></>
                    }
                </div>
                <div className='flex flex-col flex-col-reverse w-full h-[420px] display-scrollbar'>
                    {
                        !rooms ?
                        <div className='flex w-full h-full justify-center items-center bg-white'>
                            <ReactLoading type={'spin'} color={'#b4b4b4'} width={50} height={50} />
                        </div> 
                        :
                        rooms.map((room:any) => (
                            room.chats.map((chat:any, index:BigInteger, arr:any) => (
                                <StaffMessage key={index} data={chat} before={arr[index+1]} after={arr[index-1]} index={index} mutate={mutateRooms} />
                            )).concat(room.categories.map((category:any) => (
                                <div id={room.id} className='mx-4 py-1 mt-3 rounded-lg text-tinytext text-gray-400 flex justify-center bg-gray-100'>
                                    {category.category}
                                </div>
                            )))
                        ))
                    }
                </div>
                <div className='flex flex-col justify-between w-full h-[110px] border-t border-gray-300 relative'>
                    {
                        rooms && rooms[0].status == 'Pending' ? 
                        <>
                            <div className='flex w-full h-[60px] items-start'>
                                <textarea value={message} placeholder='Enter a message' className='px-3 mt-3 h-full text-smalltext w-full resize-none outline-none' onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => handleEnterDown(e)} onKeyUp={(e) => handleEnterUp(e)} />
                            </div>
                            <div className='flex w-full h-[40px] items-center px-3'>
                                <label htmlFor="file">
                                    <ImAttachment size={22} className='mr-3' />
                                </label>
                                <input className="hidden" aria-describedby="user_avatar_help" id="file" type="file" multiple onChange={(e) => setFiles(e.target.files)} />
                            </div>
                        </> 
                        :
                        <div className='flex flex-col justify-center items-center w-full h-[110px] bg-black absolute opacity-70 text-white'>
                            This chat has been closed.
                        </div>
                    }
                </div>
            </div>
            {
                fixFiles.length !== 0 ? <FilePopup fixFiles={fixFiles} files={files} onClose={onClose} roomChatId={roomChatId} /> : <></>
            }
            {
                resolve ? <ResolveChat resolve={resolve} onClose={() => setResolve(false)} roomChatId={roomChatId} refetch={onClose}  /> : 
                <></>
            }
        </>
    )
}

export default UserChat