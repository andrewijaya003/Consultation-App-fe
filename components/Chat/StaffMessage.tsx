import { RiMoreFill } from '@react-icons/all-files/ri/RiMoreFill'
import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import { AiOutlineFolder } from '@react-icons/all-files/ai/AiOutlineFolder'
import Popup from 'reactjs-popup';

function UserMessage(props:any) {
    const [more, setMore] = useState(false)
    const [user, setUser] = useState({})
    const moment = require('moment')
    const ufs = require("url-file-size")

    useEffect(() => {
        fetch(process.env.BASE_URL+`/staff/me`, {
            headers : { 
                'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                "Content-Type" : "application/json"
            },
            method: 'GET'
        }).then(
            res => res.json()
        ).then((data) => {
            setUser(data)
        })
    }, []) 

    function unsendHanler(chatId:string) {
        console.log(chatId)
        fetch(process.env.BASE_URL+`/chat/unsend-chat`, {
            headers : { 
                'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                "Content-Type" : "application/json"
            },
            method: 'PUT',
            body: JSON.stringify({
                chatId: chatId
            })
        }).then(
            res => res.json()
        ).catch(err => console.log(err))
        props.mutate()
    }

    async function downloadUsingFetch(url:string, filename:string) {
        const image = await fetch(url);
        const imageBlog = await image.blob();
        const imageURL = URL.createObjectURL(imageBlog);

        const anchor = document.createElement("a");
        anchor.href = imageURL;
        anchor.download = filename;

        document.body.appendChild(anchor);
        anchor.click();
    }
    
    return (
        props.data.staff != null ?
            props.data.message != null && props.data.message?.trim() != '' ? 
                // user tidak ada before dan tidak ada after
                moment(props.before?.time).format('hh:mm A') != moment(props.data.time).format('hh:mm A') && moment(props.after?.time).format('hh:mm A') != moment(props.data.time).format('hh:mm A') ?
                // {`px-3 flex flex-col w-full items-start mt-1.5 ${props.after == undefined ? 'mb-3' : ''}`}
                    <div id={props.data.id} className={`px-4 flex flex-col w-full items-end ${props.before == undefined ? 'mt-3' : ''}`}>
                        {
                            props.data.isUnsent ?
                            <>
                                <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                                    Message unsent.
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </> 
                            :
                            <>
                                <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                                    {props.data.staff?.name}
                                </div>
                                <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                                    {
                                        more && props.data.staff?.id == user.id ? 
                                        <Popup trigger={
                                            <div>
                                                <RiMoreFill color='rgb(156 163 175)' size={20} className='mr-1.5'/>
                                            </div>
                                        } position="bottom left"
                                        closeOnDocumentClick>
                                            <div className={`flex flex-col w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer bg-white`}>
                                                <div className='hover:bg-gray-100 px-3 py-2' onClick={() => unsendHanler(props.data.id)} >
                                                    Unsend
                                                </div>
                                            </div>
                                        </Popup>
                                        : <></>
                                    }
                                    <div className='bg-[#c7eafe] max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                        {props.data.message} 
                                    </div>
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </>
                        }
                    </div> :
                // staff tidak ada before dan ada after
                moment(props.before?.time).format('hh:mm A') != moment(props.data.time).format('hh:mm A') && moment(props.after?.time).format('hh:mm A') == moment(props.data.time).format('hh:mm A') ?
                    <div id={props.data.id} className={`px-4 flex flex-col w-full items-end ${props.before == undefined ? 'mt-3' : ''}`}>
                        {
                            props.data.isUnsent ?
                            <>
                                <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                                    Message unsent.
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </>  
                            :
                            <>
                                <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                                    {props.data.staff?.name}
                                </div>
                                <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                                    {
                                        more && props.data.staff?.id == user.id ? 
                                        <Popup trigger={
                                            <div>
                                                <RiMoreFill color='rgb(156 163 175)' size={20} className='mr-1.5'/>
                                            </div>
                                        } position="bottom left"
                                        closeOnDocumentClick>
                                            <div className={`flex flex-col w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer bg-white`}>
                                                <div className='hover:bg-gray-100 px-3 py-2' onClick={() => unsendHanler(props.data.id)} >
                                                    Unsend
                                                </div>
                                            </div>
                                        </Popup>
                                        : <></>
                                    }
                                    <div className='bg-[#c7eafe] max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                        {props.data.message} 
                                    </div>
                                </div>
                                {
                                    props.after?.message == null || props.after.staff == null ?
                                    <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                        {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                    </div> : <></>
                                }
                            </>
                        }
                    </div> :
                // staff ada before dan tidak ada after
                moment(props.before?.time).format('hh:mm A') == moment(props.data.time).format('hh:mm A') && moment(props.after?.time).format('hh:mm A') != moment(props.data.time).format('hh:mm A') ?
                    <div id={props.data.id} className={`px-4 flex flex-col w-full items-end mt-1.5`}>
                        {
                            props.data.isUnsent ?
                            <>
                                <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                                    Message unsent.
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </>  
                            :
                            <>
                                {
                                    props.before?.message == null || props.before.staff == null ?
                                    <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                                        {props.data.staff?.name} 
                                    </div> : <></>
                                }
                                <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                                    {
                                        more && props.data.staff?.id == user.id ? 
                                        <Popup trigger={
                                            <div>
                                                <RiMoreFill color='rgb(156 163 175)' size={20} className='mr-1.5'/>
                                            </div>
                                        } position="bottom left"
                                        closeOnDocumentClick>
                                            <div className={`flex flex-col w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer bg-white`}>
                                                <div className='hover:bg-gray-100 px-3 py-2' onClick={() => unsendHanler(props.data.id)} >
                                                    Unsend
                                                </div>
                                            </div>
                                        </Popup>
                                        : <></>
                                    }
                                    <div className='bg-[#c7eafe] max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                        {props.data.message} 
                                    </div>
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </>
                        }
                    </div> :
                // staff ada before dan ada after
                moment(props.before?.time).format('hh:mm A') == moment(props.data.time).format('hh:mm A') && moment(props.after?.time).format('hh:mm A') == moment(props.data.time).format('hh:mm A') ?
                    <div id={props.data.id} className={`px-4 flex flex-col w-full items-end mt-1.5`}>
                        {
                            props.data.isUnsent ?
                            <>
                                <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                                    Message unsent.
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </>  
                            :
                            <>
                                {
                                    props.before?.message == null || props.before.staff == null ?
                                    <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                                        {props.data.staff?.name} 
                                    </div> : <></>
                                }
                                <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                                    {
                                        more && props.data.staff?.id == user.id ? 
                                        <Popup trigger={
                                            <div>
                                                <RiMoreFill color='rgb(156 163 175)' size={20} className='mr-1.5'/>
                                            </div>
                                        } position="bottom left"
                                        closeOnDocumentClick>
                                            <div className={`flex flex-col w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer bg-white`}>
                                                <div className='hover:bg-gray-100 px-3 py-2' onClick={() => unsendHanler(props.data.id)} >
                                                    Unsend
                                                </div>
                                            </div>
                                        </Popup>
                                        : <></>
                                    }
                                    <div className='bg-[#c7eafe] max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                        {props.data.message} 
                                    </div>
                                </div>
                                {
                                    props.after?.message == null || props.after?.staff == undefined ?
                                    <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                        {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                    </div> : <></>
                                }
                            </>
                        }
                    </div> : <></>
                :
            // staff image
            props.data.message == null ? 
            <div id={props.data.id} className={`px-3 flex flex-col w-full items-end mt-1.5 ${props.after == undefined ? 'mb-3' : ''}`}>
                {
                    props.data.isUnsent ?
                    <>
                        <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                            Message unsent.
                        </div>
                        <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                            {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                        </div>
                    </> 
                    :
                    <>
                        <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                            {props.data.staff?.name}
                        </div>
                        <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                            {
                                more && props.data.staff?.id == user.id ?
                                <Popup trigger={
                                    <div>
                                        <RiMoreFill color='rgb(156 163 175)' size={20} className='mr-1.5'/>
                                    </div>
                                } position="bottom left"
                                closeOnDocumentClick>
                                    <div className={`flex flex-col w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer bg-white`}>
                                        <div className='hover:bg-gray-100 px-3 py-2' onClick={() => unsendHanler(props.data.id)} >
                                            Unsend
                                        </div>
                                        <div className='hover:bg-gray-100 px-3 py-2' onClick={() => downloadUsingFetch(props.data.file?.id, props.data.file?.name)}>
                                            Download
                                        </div>
                                    </div>
                                </Popup>
                                : <></>
                            }
                            {
                                props.data.file?.type.match('image.*') ? 
                                <img src={process.env.BASE_URL+'/'+props.data.file?.id} alt="" className='max-w-xs rounded-lg text-smalltext' />
                                :
                                <div className='flex justify-start items-center bg-[#c7eafe] max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                    <div className='mr-3 object-contain flex justify-center'>
                                        <AiOutlineFolder size={50} color='#222222' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className='text-smalltext'>
                                            {props.data.file?.name}
                                        </div>
                                        <div className='text-tinytext text-gray-500 mt-0.5'>
                                            222KB
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                            {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                        </div>
                    </>
                }
            </div> : <></>
        :
        props.data.staff == null ?
            props.data.message != null && props.data.message?.trim() != '' ? 
                moment(props.before?.time).format('hh:mm A') != moment(props.data.time).format('hh:mm A') && moment(props.after?.time).format('hh:mm A') != moment(props.data.time).format('hh:mm A') ?
                // className={`px-4 flex flex-col w-full  ${props.data.isUnsent ? 'items-center' : 'items-end'} ${props.before == undefined ? 'mt-3' : ''}`}
                    <div id={props.data.id} className={`px-4 flex flex-col w-full items-start ${props.before == undefined ? 'mt-3' : ''}`}>
                        {
                            props.data.isUnsent ?
                            <>
                                <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                                    Message unsent. 
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </> :
                            <>
                                <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                                    {props.data.user?.name}
                                </div>
                                <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                                    <div className='bg-gray-200 max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                        {props.data.message} 
                                    </div>
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </>
                        }
                    </div> :
                moment(props.before?.time).format('hh:mm A') != moment(props.data.time).format('hh:mm A') && moment(props.after?.time).format('hh:mm A') == moment(props.data.time).format('hh:mm A') ?
                    <div id={props.data.id} className={`px-4 flex flex-col w-full items-start ${props.before == undefined ? 'mt-3' : ''}`}>
                        {
                            props.data.isUnsent ?
                            <>
                                <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                                    Message unsent.
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </>
                            :
                            <>
                                <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                                    {props.data.user?.name} 
                                </div>
                                <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                                    <div className='bg-gray-200 max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                        {props.data.message}
                                    </div>
                                </div>
                                {
                                    props.after?.message == null || props.after?.user == null ?
                                    <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                        {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                    </div> : <></>
                                }
                            </>
                        }
                    </div> :
                moment(props.before?.time).format('hh:mm A') == moment(props.data.time).format('hh:mm A') && moment(props.after?.time).format('hh:mm A') != moment(props.data.time).format('hh:mm A') ?
                    <div id={props.data.id} className={`px-4 flex flex-col w-full items-start mt-1.5`}>
                        {
                            props.data.isUnsent ?
                            <>
                                <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                                    Message unsent.
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </>
                            :
                            <>
                                {
                                    props.before?.message == null || props.before?.user == null ?
                                    <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                                        {props.data.user?.name}
                                    </div> : <></>
                                }
                                <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                                    <div className='bg-gray-200 max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                        {props.data.message} 
                                    </div>
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </>
                        }
                    </div> :
                moment(props.before?.time).format('hh:mm A') == moment(props.data.time).format('hh:mm A') && moment(props.after?.time).format('hh:mm A') == moment(props.data.time).format('hh:mm A') ?
                    <div id={props.data.id} className={`px-4 flex flex-col w-full items-start mt-1.5`}>
                        {
                            props.data.isUnsent ?
                            <>
                                <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                                    Message unsent.
                                </div>
                                <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                    {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                </div>
                            </> 
                            :
                            <>
                                {
                                    props.before?.message == null || props.before?.user == null ?
                                    <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                                        {props.data.user?.name}
                                    </div> : <></>
                                }
                                <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                                    <div className='bg-gray-200 max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                        {props.data.message} 
                                    </div>
                                </div>
                                {
                                    props.after?.message == null || props.after?.user == null ?
                                    <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                        {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                                    </div> : <></>
                                }
                            </>
                        }
                    </div> : <></>
                :
            props.data.message == null ? 
                <div id={props.data.id} className={`px-3 flex flex-col w-full items-start mt-1.5 ${props.after == undefined ? 'mb-3' : ''}`}>
                    {
                        props.data.isUnsent ?
                        <>
                            <div className='bg-gray-100 max-w-2xl py-1 px-2 rounded-lg text-tinytext text-gray-400'>
                                Message unsent.
                            </div>
                            <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                            </div>
                        </> 
                        :
                        <>
                            <div className='max-w-2xl py-1.5 text-smalltext text-gray-500'>
                                {props.data.user?.name}
                            </div>
                            <div onMouseOver={() => setMore(true)} onMouseOut={() => setMore(false)} className='flex items-end hover:cursor-pointer'>
                                {
                                    props.data.file?.type.match('image.*') ? 
                                    <img src={process.env.BASE_URL+'/'+props.data.file?.id} alt="" className='max-w-xs rounded-lg text-smalltext' />
                                    :
                                    <div className='flex justify-start items-center bg-gray-200 max-w-2xl py-1.5 px-2 rounded-lg text-smalltext'>
                                        <div className='mr-3 object-contain flex justify-center'>
                                            <AiOutlineFolder size={50} color='#222222' />
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className='text-smalltext'>
                                                {props.data.file?.name}
                                            </div>
                                            <div className='text-tinytext text-gray-500 mt-0.5'>
                                                222KB
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    more ? 
                                    <Popup trigger={
                                        <div>
                                            <RiMoreFill color='rgb(156 163 175)' size={20} className='mr-1.5'/>
                                        </div>
                                    } position="bottom left"
                                    closeOnDocumentClick>
                                        <div className={`flex flex-col w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer bg-white`}>
                                            <div className='hover:bg-gray-100 px-3 py-2' onClick={() => downloadUsingFetch(props.data.file?.id, props.data.file?.name)} >
                                                Download
                                            </div>
                                        </div>
                                    </Popup>
                                    : <></>
                                }
                            </div>
                            <div className='max-w-2xl py-1.5 text-xtinytext text-gray-400'>
                                {moment(props.data.time).format('YYYY-MM-DD, hh:mm A')}
                            </div>
                        </>
                    }
                </div> : <></>
        : <></>
    )
}

export default UserMessage