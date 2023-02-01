import React, { useEffect, useMemo } from 'react'
import {RiMore2Fill} from "react-icons/ri"

function HeaderChat(props:any) {
    return (
        props.header.lastChat != null ?
        <div className='px-4 py-3 flex h-[700px] w-full hover:cursor-pointer hover:bg-gray-100' onClick={props.getChats}>
            {
                props.header?.user.user_picture != undefined || props.header?.user.user_picture != null ?
                <div className='relative w-full h-full top-0'>
                    <img src={`data:image/png;base64, ${props.header?.user.user_picture}`} alt="" className='w-[55px] h-[55px] absolute rounded-full object-cover top-[-6px]' />
                </div>
                :
                <div className='relative w-full h-full top-0'>
                    <img src="/no-image.jpg" alt="" className='w-[55px] h-[55px] absolute rounded-full object-cover top-[-6px]' />
                </div>
            }
            <div className='flex w-full flex-col w-3/5'>
                <div className='text-smalltext font-bold truncate'>
                    {props.header?.user.name}
                </div>
                <div className='flex'>
                    <div className='text-tinytext text-gray-500 truncate w-[275px]'>
                        {props.header.lastChat?.isUnsent == true ? 'Message unsent' : props.header.lastChat?.message == null ? 'You sent a file' : props.header.lastChat?.message}
                    </div>
                </div>
            </div>
            <div className='flex w-full flex-col items-end'>
                {
                    props.header.lastChat.readTime == null && props.header.lastChat.staff == null ?
                    <div className='rounded-full bg-blue w-2.5 h-2.5 mb-1.5'/>
                    :
                    <div className='rounded-full bg-transparent w-2.5 h-2.5 mb-1.5' />
                }
                <div className={`text-tinytext text-white ${props.header.status == 'Closed' ? 'bg-red' : props.header.status == 'Done' ? 'bg-[#83d475]' : 'bg-yellow'} p-1 rounded`}>
                    {props.header.status}
                </div>
            </div>
        </div> : <></>
    )
}

export default HeaderChat