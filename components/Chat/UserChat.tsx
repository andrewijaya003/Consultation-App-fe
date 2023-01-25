import React, { useEffect, useMemo, useState } from 'react'
import { ImAttachment } from "@react-icons/all-files/im/ImAttachment";
import { RiEmotionHappyLine } from "@react-icons/all-files/ri/RiEmotionHappyLine";
import { RiMoreFill } from "@react-icons/all-files/ri/RiMoreFill";
import UserMessage from './UserMessage';
import FilePopup from './FilePopup';
import { getCookie } from 'cookies-next';
import useSWR from 'swr';
import ReactLoading from 'react-loading';
import { useDebounce } from 'use-debounce';
import {io} from 'socket.io-client'
import RatingAddPopup from '../Rating/RatingAddPopup';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const fetcher = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function UserChat(props:any) {
    const [more, setMore] = useState(false)
    const [files, setFiles] = useState([])
    const [fixFiles, setFixFiles] = useState([])
    const [message, setMessage] = useState('')
    const [shift, setShift] = useState(false)
    const [endpointChats, setEndpointChats] = useState(process.env.BASE_URL+'/chat/room/'+props.roomChatId) 
    const {data: chats, mutate: mutateChats} = useSWR(endpointChats, fetcher)
    const [endpointActiveRoom, setEndpointActiveRoom] = useState(process.env.BASE_URL+'/room-chat/active-user-room-chat')
    const {data: activeRoom, mutate: mutateActiveRoom} = useSWR(endpointActiveRoom, 
    () => fetch(endpointActiveRoom, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'POST',
    }).then(res => res.json()))
    // let socket = io('http://localhost:8000', { transports: ['websocket', 'polling', 'flashsocket'] })
    const [add, setAdd] = useState(false)
    const [searchChat, setSearchChat] = useState('')
    const [bounceSearchChat] = useDebounce(searchChat, 1000)
    const [searchChatData, setSearchChatData] = useState([])
    const [indexChat, setIndexChat] = useState(0)
    const socket = useMemo<any>(()=>{
        if (!window) return;

        const socket = io('http://localhost:8000');
        socket.on('receive-message', (data => (
            console.log(data)
            // mutateRooms()
        )))
        console.log("test");

        return socket;
    }, [window])

    useEffect(()=>{
        return () => {
            socket.disconnect()
        }
    }, []);

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
        await mutateActiveRoom()
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
            console.log(props.roomChatId)
            let sendChat = new FormData()
            sendChat.append('roomId', props.roomChatId)
            sendChat.append('message', message)

            const data:any = await fetch(process.env.BASE_URL + '/chat', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                },
                method: 'POST',
                body: sendChat
            }).then((res) => res.json())
            
            socket.emit('message', {roomId: props.roomChatId, data: data})
            // mutateChats()

            setMessage('')
        } else if(e.key == 'Enter' && !shift ) {
            setMessage('')
        } 
    }

    useEffect(() => {
        // console.log(activeRoom)
    }, [activeRoom])

    const refetch = async () => {
        await props.fetchRoomChat()
        setAdd(false)
    }

    useEffect(() => {
        console.log(bounceSearchChat)
        if(bounceSearchChat != '') {
            fetch(process.env.BASE_URL + '/chat/active-or-not-rated-room/'+searchChat, {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'GET',
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
                <div className='flex flex-col px-4 h-[70px] justify-center border-b border-gray-300'>
                    <div className='flex'>
                        <input value={searchChat} type="text" className='mr-2 w-full px-2.5 py-2 text-smalltext text-gray-900 bg-gray-200 rounded-md appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer' placeholder='Search chats' onChange={(e) => setSearchChat(e.target.value)} />
                        {
                            searchChatData.length != 0 ?
                            <div className='flex flex-col'>
                                <IoIosArrowUp size={18} className={`hover:cursor-pointer`} onClick={() => handleArrowChat(indexChat-1)} />
                                <IoIosArrowDown size={18} className={`hover:cursor-pointer`} onClick={() => handleArrowChat(indexChat+1)} />
                            </div>
                            :
                            <></>
                        }
                    </div>
                </div>
                <div className='flex flex-col flex-col-reverse w-full h-[420px] display-scrollbar'>
                    {
                        !chats ?
                        <div className='flex w-full h-full justify-center items-center bg-white'>
                            <ReactLoading type={'spin'} color={'#b4b4b4'} width={50} height={50} />
                        </div> :
                        chats.map((data:any, index:BigInteger, arr:any) => (
                            <UserMessage key={index} data={data} before={arr[index+1]} after={arr[index-1]} index={index} />
                        ))
                    }
                </div>
                <div className='flex flex-col justify-between w-full h-[110px] border-t border-gray-300 relative'>
                    {
                        activeRoom != undefined ?
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
                        <div className='flex flex-col justify-center items-center w-full h-[110px] bg-black absolute opacity-70'>
                            <div className='text-white mb-2'>
                                This chat has been closed. Please input rating if you want contact us again.
                            </div>
                            <div className='rounded bg-blue text-white p-2 hover:cursor-pointer font-bold' onClick={() => setAdd(true)}>
                                Input rating
                            </div>
                        </div>
                    }
                </div>
            </div>
            {
                fixFiles.length !== 0 ? <FilePopup fixFiles={fixFiles} files={files} onClose={onClose} roomChatId={props.roomChatId} /> : <></>
            }
            {
                add ? 
                <RatingAddPopup add={add} onClose={() => setAdd(false)} refetch={refetch} roomChatId={props.roomChatId} /> 
                :
                <></>
            }
        </>
    )
}

export default UserChat