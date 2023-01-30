import React, { useEffect, useState } from 'react'
import { RiDeleteBinLine } from "@react-icons/all-files/ri/RiDeleteBinLine";
import { FiEdit2 } from "@react-icons/all-files/fi/FiEdit2";
import AnnouncementEditPopup from './AnnouncementEditPopup';
import AnnouncementDeletePopup from './AnnouncementDeletePopup';
import AlertNoData from '../AlertNoData';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import {mutate} from 'swr';

function AnnouncementList(props:any) {
    const moment = require('moment')
    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState()
    const [announcements, setAnnouncemets] = useState([])

    function editHandler(value:any){
        setSelectedAnnouncement(value)
        setEdit(true)
    }

    function deleteHandler(value:any){
        setSelectedAnnouncement(value)
        setDel(true)
    } 

    const refetchEdit = async () => {
        await mutate(props.endpoint)
        setEdit(false)
    }

    const refetchDel = async () => {
        await mutate(props.endpoint)
        setDel(false)
    }

    useEffect(() => {
        setSelectedAnnouncement(selectedAnnouncement)
    }, [edit, del])

    useEffect(() => {
        console.log(props.announcements)
        setAnnouncemets(props.announcements)
    }, [props.announcements])

    return (
        <>
            <div className='flex flex-col'>
                {
                    announcements.length === 0?
                    <AlertNoData title='announcement' />
                    :
                    announcements.map((announcement:any) => (
                        <div className='text-secblack flex sm:flex-col lg:flex-row sm:items-center lg:items-start border border-gray-300 rounded-lg px-6 py-5 mb-6 bg-white shadow-xm'>
                            {/* <div>{announcement.file.id}</div> */}
                            <img className='max-w-[140px] object-contain w-full lg:mr-6 sm:mb-6 lg:mb-0' src={ announcement.file != null ? process.env.BASE_URL+'/'+announcement.file.id:'https://i.ibb.co/xHzDz3R/announcement-placeholder.png' } />
                            <div className='flex flex-col w-full'>
                                <div className='flex justify-between'>
                                    <div className='text-start mb-2 text-[19px] font-bold whitespace-pre-wrap break-all'>
                                        { announcement.title }
                                    </div>
                                    {
                                        getCookie('ROLE') == 'STAFF' ?
                                        <div className='flex text-end text-tinytext text-gray-400 h-fit whitespace-pre-wrap'>
                                            Posted for
                                            {
                                                announcement.target.map((role:any, index:BigInteger) => (
                                                    <div className='font-bold'>
                                                        {
                                                            index == 0 ? 
                                                            ' '+role
                                                            :
                                                            ', '+role
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        :
                                        <></>
                                    }
                                </div>
                                <div className='text-start text-smalltext whitespace-pre-wrap break-word'>
                                    { announcement.description } 
                                </div>
                                {
                                    getCookie('ROLE') === 'STAFF' ?
                                    <div className='text-end text-tinytext text-gray-400 mt-4'>
                                        Updated by on { moment(announcement.lastUpdatedTime).format('DD MMMM YYYY') }
                                    </div> : <></>
                                }
                                {
                                    getCookie('ROLE') === 'STAFF' ? 
                                    <div className="text-end text-smalltext font-bold flex w-full justify-end mt-2">
                                        <div className='flex py-2 px-4 rounded bg-yellow items-center text-white mr-3 hover:cursor-pointer' onClick={() => editHandler(announcement)}>
                                            <FiEdit2 className='text-smalltitle mr-1.5' />
                                            Edit
                                        </div>
                                        <div className='flex py-2 px-4 rounded bg-red items-center text-white hover:cursor-pointer' onClick={() => deleteHandler(announcement)}>
                                            <RiDeleteBinLine className='text-smalltitle mr-1.5' />
                                            Delete
                                        </div>
                                    </div> : <></>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                getCookie('ROLE') === 'STAFF' ? 
                <>
                    <AnnouncementEditPopup announcement={selectedAnnouncement} edit={edit} onClose={() => setEdit(false)} refetch={refetchEdit} />
                    <AnnouncementDeletePopup announcement={selectedAnnouncement} del={del} onClose={() => setDel(false)} refetch={refetchDel} />
                </> : <></>
            }
        </>
    )
}

export default AnnouncementList