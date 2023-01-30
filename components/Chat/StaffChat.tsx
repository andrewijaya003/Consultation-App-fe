import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ImAttachment } from "@react-icons/all-files/im/ImAttachment";
import {IoIosArrowBack, IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import {BsInfoCircle} from "react-icons/bs";
import FilePopup from './FilePopup';
import { getCookie } from 'cookies-next';
import useSWR, { mutate } from 'swr';
import ReactLoading from 'react-loading';
import { useDebounce } from 'use-debounce';
import StaffMessage from './StaffMessage';
import {io} from 'socket.io-client'
import ResolveChat from './ResolveChat';
import InfiniteScroll from 'react-infinite-scroll-component'
import { Socket } from 'socket.io';
import UserNotes from './UserNotes';
import Popup from 'reactjs-popup';
import EndRoomChatPopup from './EndRoomChatPopup';

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
    const [userId, setUserId] = useState('')
    const [roomChatId, setRoomChatId] = useState('')
    const [endpointRooms, setEndpointRooms] = useState(process.env.BASE_URL+'/room-chat/room-chats-by-user/'+props.userId)
    // const {data: rooms, mutate: mutateRooms} = useSWR(endpointRooms, fetcher)
    const [offsetRooms, setOffsetRooms] = useState(0)
    const [takeRooms, setTakeRooms] = useState(3)
    const [newRooms, setNewRooms] = useState([])
    const [isFetchMore, setIsFetchMore] = useState(false)
    const [rooms, setRooms] = useState<Object[]>()
    const [userNotes, setUserNotes] = useState(false)
    const [endRoomChatPopup, setEndRoomChatPopup] = useState(false)
    const [roomForendRoomChatPopup, setRoomForEndRoomChatPopup] = useState()
    
    const [resolve, setResolve] = useState(false)
    const [searchChat, setSearchChat] = useState('')
    const [bounceSearchChat] = useDebounce(searchChat, 1000)
    const [searchChatData, setSearchChatData] = useState([])
    const [indexChat, setIndexChat] = useState(0)
    const [isTyping, setIstyping] = useState(false)
    const [scrollBar, setScrollBar] = useState<Number>()
    const {data:user, mutate:userMutate} = useSWR(process.env.BASE_URL + '/auth/me', fetcherUser)

    useEffect(() => {
        if (rooms == undefined) return

        props.socket.on('user-read-all-message', ((data:string) => {
            fetch(process.env.BASE_URL+'/chat/read-all-chat/'+data.data, {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    'Content-type': 'application/json'
                },
                method: 'PUT',
            }).then(res => res.json()).then((data) => console.log(data))

            if(rooms != undefined) {
                rooms?.map((room:any) => {
                    if(room.id == data.data) {
                        console.log(room.id+' '+data.data)
                        room.chats.map((chat:any) => {
                            if(chat.staff != null) {
                                console.log('ini chat staff')
                                chat.readTime = new Date()
                            }
                        })
                    }
                })
                setRooms([...rooms])
            }
            
            props.readHeader(data.data)
        }))

        return () => {
            props.socket.off('user-read-all-message')
        }
    }, [rooms])

    useEffect(() => {
        if (rooms == undefined) return

        props.socket.on('receive-unsend-message', ((data:any) => {
            if(rooms != undefined){
                if(rooms[0].chats[0] != undefined) {
                    let index:number = rooms[0].chats.findIndex(i => i.id === data.data.message.id)
                    rooms[0].chats.splice(index, 1, data.data.message)
                    setRooms([...rooms])
                }
            }
        }))

        return  () => {
            props.socket.off('receive-unsend-message')
        }
    }, [rooms])

    const socketUnsend = (data:any) => {
        if(rooms != undefined){
            if(rooms[0].chats[0] != undefined) {
                let index:number = rooms[0].chats.findIndex(i => i.id === data.id)
                rooms[0].chats.splice(index, 1, data)
                setRooms([...rooms])
            }
        }
        props.socket.emit('unsend-message', {message: data})
    }

    useEffect(() => {
        if (rooms == undefined) return

        props.socket.on('receive-message', ((data:any) => {
            console.log(data)
            if(rooms != undefined){
                if(data.data.message[0]?.file != null) {
                    if(rooms[0].chats[0] != undefined) {
                        data.data.message.map((message:any) => {
                            rooms[0].chats.unshift(message)
                        })
                    }
                } else {
                    if(rooms[0].chats[0] != undefined) {
                        rooms[0].chats.unshift(data.data.message)
                    }
                }
                setRooms([...rooms])
            }
            props.changeHeader(data.data.message)
        }))

        return () => {
            props.socket.off('receive-message')
        }
    }, [rooms])

    useEffect(() => {
        props.socket.on('client-start-typing', () => {
            setIstyping(true)
        })

        return () => {
            props.socket.off('client-start-typing')
        }
    }, [])

    useEffect(() => {
        props.socket.on('client-stop-typing', () => {
            setIstyping(false)
        })

        return () => {
            props.socket.off('client-stop-typing')
        }
    }, [])


    container?.addEventListener('scroll', (e) => {
        setScrollBar(container.scrollTop)
        if (container.clientHeight + (container.scrollTop*-1) >= container.scrollHeight-20 && rooms != undefined) {
            setIsFetchMore(true)
        }
    })

    useEffect(() => {
        if(roomChatId != '') {
            props.socket.emit('read-all-message', roomChatId)
        }
    }, [scrollBar])

    useEffect(() => {
        setIsFetchMore(false)
        if(newRooms.length != 0 && rooms != undefined) {
            setRooms([...rooms, ...newRooms])
        }
    }, [newRooms])

    useEffect(() => {
        if(isFetchMore) {
            fetch(process.env.BASE_URL+'/room-chat/room-chats-by-user/', {
                headers: {
                    'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    userId: props.userId,
                    offset: offsetRooms,
                    take: takeRooms
                })
            }).then(res => res.json()).then((data) => {
                setOffsetRooms(takeRooms)
                setTakeRooms(takeRooms+3)
                setNewRooms(data)
            })
        }
    }, [isFetchMore])

    useEffect(() => {
        fetch(process.env.BASE_URL+'/room-chat/room-chats-by-user/', {
            headers: {
                'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                userId: props.userId,
                offset: 0,
                take: 3
            })
        }).then(res => res.json()).then((data) => {
            setRooms(data)
            setOffsetRooms(3)
            setTakeRooms(6)
        })
    }, [props.userId])
    

    useEffect(() => {
        // console.log(props.focusIdComponent)
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
        // await mutateRooms()
        setFiles([])
        setFixFiles([])
    }

    function handleEnterDown(e:any) {
        if(e.key == 'Shift') {
            setShift(true)
        }
    }

    function appendNewChat(data:any) {
        if(rooms != undefined){
            if(data[0]?.file != null) {
                if(rooms[0].chats[0] != undefined) {
                    data.map((message:any) => {
                        rooms[0].chats.unshift(message)
                    })
                }
            } else {
                if(rooms[0].chats[0] != undefined) {
                    rooms[0].chats.unshift(data)
                }
            }
            setRooms([...rooms])
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
            }).then((res) => res.json()).then((data) => {
                props.socket.emit('message', {message: data})
                appendNewChat(data)
                props.changeHeader(data)
                setMessage('')
            })
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
        console.log(rooms)
        if(rooms) {
            document.getElementById(props.focusIdComponent)?.scrollIntoView()
        }
    }, [rooms])

    useEffect(() => {
        if(bounceSearchChat != '') {
            fetch(process.env.BASE_URL + '/chat/search', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    message: bounceSearchChat
                })
            }).then((res) => res.json()).then((data) => setSearchChatData(data))
        } else {
            setSearchChatData([])
        }
    }, [bounceSearchChat])

    useEffect(() => {
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
        if(message != '') {
            props.socket.emit('read-all-message', roomChatId)
            props.readHeader(roomChatId)
            props.socket.emit('start-typing')
        } else {
            props.socket.emit('stop-typing')
        }
    }, [message])

    function endRoomChatPopupHandler(room:any) {
        setEndRoomChatPopup(true)
        setRoomForEndRoomChatPopup(room)
    }
    
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
                    <BsInfoCircle size={30} className={`hover:cursor-pointer`} onClick={() => setUserNotes(true)} />
                    {
                        rooms && rooms[0].status == 'Pending' ? 
                        <input type="submit" value='End' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer ml-2' onClick={() => setResolve(true)} />
                        :
                        <></>
                    }
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
                        rooms == undefined ?
                        <div className='flex w-full h-full justify-center items-center bg-white'>
                            <ReactLoading type={'spin'} color={'#b4b4b4'} width={50} height={50} />
                        </div> 
                        :
                        rooms.map((room:any) => (
                            room.chats.map((chat:any, index:BigInteger, arr:any) => (
                                <StaffMessage socketUnsend={socketUnsend} key={index} data={chat} before={arr[index+1]} after={arr[index-1]} index={index} user={user} />
                            )).concat(room.categories.map((category:any) => (
                                <div id={room.id} className='mx-4 py-1 mt-3 rounded-lg text-tinytext text-white flex justify-center bg-blue hover:cursor-pointer' onClick={() => endRoomChatPopupHandler(room)}>
                                    {category.category}
                                </div>
                            )))
                        ))
                    }
                </div>
                <div className='flex flex-col justify-between w-full h-[110px] border-t border-gray-300 relative'>
                    {
                        rooms == undefined ?
                        <></>
                        :
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
                fixFiles.length !== 0 ? <FilePopup changeHeader={props.changeHeader} appendNewChat={appendNewChat} socket={props.socket} fixFiles={fixFiles} files={files} onClose={onClose} roomChatId={roomChatId} /> : <></>
            }
            {
                resolve ? <ResolveChat resetUserId={props.resetUserId} socket={props.socket} resolve={resolve} onClose={() => setResolve(false)} roomChatId={roomChatId} refetch={onClose}  /> : 
                <></>
            }
            {
                userNotes ?
                <UserNotes userNotes={userNotes} onClose={() => setUserNotes(false)} userId={props.userId} />
                :
                <></>
            }
            {
                endRoomChatPopup ?
                <EndRoomChatPopup endRoomChatPopup={endRoomChatPopup} room={roomForendRoomChatPopup} onClose={() => setEndRoomChatPopup(false)} />
                :
                <></>
            }
        </>
    )
}

export default UserChat