import React, { useState } from 'react'
import { RiDeleteBinLine } from "@react-icons/all-files/ri/RiDeleteBinLine";
import { FiEdit2 } from "@react-icons/all-files/fi/FiEdit2";
import AnnouncementEditPopup from './AnnouncementEditPopup';
import AnnouncementDeletePopup from './AnnouncementDeletePopup';
import AlertNoData from '../AlertNoData';

function AnnouncementList(props:any) {
    const moment = require('moment')
    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)
    const [announcement, setAnnouncement] = useState('')

    function editHandler(announcement:any){
        setEdit(true)
        setAnnouncement(announcement)
    }

    function deleteHandler(announcement:any){
        setDel(true)
        setAnnouncement(announcement)
    } 

    return (
        <>
            <div className='flex flex-col'>
                {
                    props.announcements.length === 0?
                    <AlertNoData title='announcement' />
                    :
                    props.announcements.map((announcement:any) => (
                        <div className='text-secblack flex sm:flex-col lg:flex-row sm:items-center lg:items-start border border-gray-300 rounded-lg px-6 py-5 mb-6 bg-white shadow-xm'>
                            <img className='max-w-[140px] object-contain w-full lg:mr-6 sm:mb-6 lg:mb-0' src={ announcement.image } alt="" />
                            <div className='flex flex-col w-full'>
                                <div className='text-start mb-2 text-[19px] font-bold whitespace-pre-wrap break-all'>
                                    { announcement.title }
                                </div>
                                <div className='text-justify text-smalltext whitespace-pre-wrap break-all'>
                                    { announcement.description } 
                                </div>
                                <div className='text-end text-tinytext text-gray-400 mt-4'>
                                    Updated by { announcement.updatedBy } on { moment(announcement.lastUpdate).format('DD MMMM YYYY') }
                                </div>
                                <div className="text-end text-smalltext font-bold flex w-full justify-end mt-2">
                                    <div className='flex py-2 px-4 rounded bg-yellow items-center text-white mr-3 hover:cursor-pointer' onClick={() => editHandler(announcement)}>
                                        <FiEdit2 className='text-smalltitle mr-1.5' />
                                        Edit
                                    </div>
                                    <div className='flex py-2 px-4 rounded bg-red items-center text-white hover:cursor-pointer' onClick={() => deleteHandler(announcement)}>
                                        <RiDeleteBinLine className='text-smalltitle mr-1.5' />
                                        Delete
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <AnnouncementEditPopup announcement={announcement} edit={edit} onClose={() => setEdit(false)} />
            <AnnouncementDeletePopup announcement={announcement} del={del} onClose={() => setDel(false)} />
        </>
    )
}

export default AnnouncementList