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
import { State } from 'swr/dist/types';
import AlertLoading from '../AlertLoading';

const fetcher = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
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

function UserChat(props:any) {
    const container = document.querySelector('#chat-container')
    const [files, setFiles] = useState([])
    const [fixFiles, setFixFiles] = useState([])
    const [message, setMessage] = useState('')
    const [shift, setShift] = useState(false)
    const [chats, setChats] = useState()
    const [offsetChats, setOffsetChats] = useState(0)
    const [takeChats, setTakeChats] = useState(15)
    const [newChats, setNewChats] = useState([])
    const [isFetchMore, setIsFetchMore] = useState(false)
    const [endpointActiveRoom, setEndpointActiveRoom] = useState(process.env.BASE_URL+'/room-chat/active-user-room-chat')
    const {data: activeRoom, mutate: mutateActiveRoom} = useSWR(endpointActiveRoom, 
    () => fetch(endpointActiveRoom, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'POST',
    }).then(res => res.json()))
    const [isDisplay, setIsDisplay] = useState(false)
    const [add, setAdd] = useState(false)
    const [searchChat, setSearchChat] = useState('')
    const [bounceSearchChat] = useDebounce(searchChat, 1000)
    const [searchChatData, setSearchChatData] = useState([])
    const [indexChat, setIndexChat] = useState(0)
    const [isTyping, setIstyping] = useState(false)
    const [scrollBar, setScrollBar] = useState<Number>()
    const [isActiveRoom, setIsActiveRoom] = useState(true)
    const {data:user, mutate:userMutate} = useSWR(process.env.BASE_URL + '/auth/me', fetcherUser)
    const socket = useMemo<any>(()=>{
        if (!window) return;

        const socket = io('http://localhost:8000')

        return socket;
    }, [window])

    useEffect(() => {
        if(chats == undefined) return

        socket.on('user-read-all-message', ((data:any) => {
            console.log(data)
            fetch(process.env.BASE_URL+'/chat/read-all-chat/'+data.data, {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    'Content-type': 'application/json'
                },
                method: 'PUT',
            }).then(res => res.json()).then((data) => console.log(data))

            if(chats != undefined) {
                chats.map((chat:any) => {
                    if(chat.readTime == null && chat.user != null) {
                        chat.readTime = new Date()
                    }
                })
                setChats([...chats])
            }
        }))

        return  () => {
            socket.off('user-read-all-message')
        }
    }, [chats])

    useEffect(() => {
        if(chats == undefined) return 

        socket.on('receive-unsend-message', ((data:any) => {
            if(chats != undefined) {
                let index:number = chats?.findIndex(i => i.id === data.data.message.id)
                chats?.splice(index, 1, data.data.message)
                setChats([...chats])
            }
        }))

        return  () => {
            socket.off('receive-unsend-message')
        }
    }, [chats])

    const socketUnsend = (data:any) => {
        if(chats != undefined){
            let index:number = chats.findIndex(i => i.id === data.id)
            chats.splice(index, 1, data)
            setChats([...chats])
        }

        socket.emit('unsend-message', {message: data})
    }

    useEffect(() => {
        if(chats == undefined) return
        
        socket.on('receive-message', ((data:any) => {
            if(chats != undefined) {
                if(data.data.message[0]?.file != null) {
                    data.data.message.map((message:any) => {
                        chats?.unshift(message)
                    })
                } else {
                    chats?.unshift(data.data.message)
                }
                setChats([...chats])
            }
        }))

        return () => {
            socket.off('receive-message')
        }
    }, [chats])

    useEffect(() => {
        socket.on('client-start-typing', () => {
            setIstyping(true)
        })

        return () => {
            socket.off('client-start-typing')
        }
    }, [])

    useEffect(() => {
        socket.on('client-stop-typing', () => {
            setIstyping(false)
        })

        return () => {
            socket.off('client-stop-typing')
        }
    }, [])

    useEffect(()=>{
        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if(user) {
            socket.emit('user-online', {id: user.id})
        }
    }, [user])

    container?.addEventListener('scroll', (e) => {
        setScrollBar(container.scrollTop)
        if (container.clientHeight + (container.scrollTop*-1) >= container.scrollHeight-20 && chats != undefined) {
            setIsFetchMore(true)
        }
    })

    useEffect(() => {
        socket.emit('read-all-message', props.roomChatId)
    }, [scrollBar])

    useEffect(() => {
        if(chats == undefined) return

        socket.on('room-status-change', ((data:any) => {
            if(chats != undefined) {
                mutateActiveRoom(undefined)
                setIsActiveRoom(false)
            }
        }))

        return () => {
            socket.off('room-status-change')
        }
    }, [chats])

    useEffect(() => {
        setIsFetchMore(false)
        console.log(newChats)
        if(newChats.length != 0 && chats != undefined) {
            setChats([...chats, ...newChats])
        }
    }, [newChats])

    useEffect(() => {
        if(isFetchMore) {
            fetch(process.env.BASE_URL+'/chat/room', {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    roomId: props.roomChatId,
                    offset: offsetChats,
                    take: takeChats
                })
            }).then(res => res.json()).then((data) => {
                setOffsetChats(takeChats)
                setTakeChats(takeChats+15)
                setNewChats(data)
            })
        }
    }, [isFetchMore])

    useEffect(() => {
        fetch(process.env.BASE_URL+'/chat/room', {
            headers: {
                'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                roomId: props.roomChatId,
                offset: 0,
                take: 15
            })
        }).then(res => res.json()).then((data) => {
            setChats(data)
            setOffsetChats(15)
            setTakeChats(30)
        })
    }, [props.roomChatId])

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

    function appendNewChat(data:any) {
        if(chats != undefined) {
            if(data[0]?.file != null) {
                data.map((message:any) => {
                    chats.unshift(message)
                })
            } else {
                chats.unshift(data)
            }
            setChats([...chats])
        }
    }

    async function handleEnterUp(e:any) {
        if(e.key == 'Shift') {
            setShift(false)
        }
        if(e.key == 'Enter' && !shift && message.trim() != '') {
            let sendChat = new FormData()
            sendChat.append('roomId', props.roomChatId)
            sendChat.append('message', message)

            const data:any = await fetch(process.env.BASE_URL + '/chat', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-Disposition': 'form-data'
                },
                method: 'POST',
                body: sendChat
            }).then((res) => res.json()).then((data) => {
                socket.emit('message', {message: data})
                socket.emit('notify-all-staff', {message: data})
                appendNewChat(data)
                setMessage('')
            })
        } else if(e.key == 'Enter' && !shift ) {
            setMessage('')
        } 
    }

    const refetch = async () => {
        setIsDisplay(false)
        setAdd(false)
    }

    useEffect(() => {
        // console.log(bounceSearchChat)
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
        // console.log(searchChatData)
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
        document.getElementById(searchChatData[indexChat]?.id)?.scrollIntoView()
    }, [indexChat])

    useEffect(() => {
        // console.log(chats)
    }, [chats])

    useEffect(() => {
        console.log(message)
        if(message != '') {
            socket.emit('read-all-message', props.roomChatId)
            socket.emit('start-typing')
        } else {
            socket.emit('stop-typing')
        }
    }, [message])

    useEffect(() => {
        // console.log(isFetchMore)
    }, [isFetchMore])

    useEffect(() => {
        if(activeRoom != undefined) {
            if(activeRoom.lastChatTime == null) {
                console.log(activeRoom)
                let sendChat = new FormData()
                sendChat.append('roomId', activeRoom.id)
                sendChat.append('message', `Kode: ${user.code}\r\nNama: ${user.name}`)
    
                fetch(process.env.BASE_URL + '/chat', {
                    headers : { 
                        'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                        'Content-Disposition': 'form-data'
                    },
                    method: 'POST',
                    body: sendChat
                }).then((res) => res.json()).then((data) => {
                    socket.emit('message', {message: data})
                    socket.emit('notify-all-staff', {message: data})
                    appendNewChat(data)
                    setMessage('')
                })
            }
        }
    }, [activeRoom])

    useEffect(() => {
        setIsDisplay(false)
        const timer = setTimeout(() => {
            setIsDisplay(true)
        }, 1500);
        return () => clearTimeout(timer);
    }, []);
    
    return (
        isDisplay ?
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
                <div className='flex flex-col flex-col-reverse w-full h-[420px] display-scrollbar' id='chat-container'>
                    {
                        isTyping ?
                        <div className={`animate-pulse px-4 flex flex-col w-full items-start my-3`}>
                            <div className='bg-gray-200 max-w-2xl py-1 px-2 rounded-lg text-smalltext font-bold'>
                                Is typing a message . . .
                            </div>
                        </div> 
                        :
                        <></>
                    }
                    {
                        chats == undefined ?
                        <div className='flex w-full h-full justify-center items-center bg-white'>
                            <ReactLoading type={'spin'} color={'#b4b4b4'} width={50} height={50} />
                        </div> :

                        chats.map((data:any, index:BigInteger, arr:any) => (
                            <UserMessage socketUnsend={socketUnsend} socket={socket} key={index} data={data} before={arr[index+1]} after={arr[index-1]} index={index} user={user} />
                        ))
                    }
                </div>
                <div className='flex flex-col justify-between w-full h-[110px] border-t border-gray-300 relative'>
                    {
                        // !activeRoom ?
                        // <></>
                        // :
                        activeRoom ?
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
                fixFiles.length !== 0 ? <FilePopup appendNewChat={appendNewChat} socket={socket} fixFiles={fixFiles} files={files} onClose={onClose} roomChatId={props.roomChatId} /> : <></>
            }
            {
                add ? 
                <RatingAddPopup resetRoomChatData={props.resetRoomChatData} mutateRoomChat={props.mutateRoomChat} add={add} onClose={() => setAdd(false)} refetch={refetch} roomChatId={props.roomChatId} /> 
                :
                <></>
            }
        </> :
        <AlertLoading title='chat' />
    )
}

export default UserChat