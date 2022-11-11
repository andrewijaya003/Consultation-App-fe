import React from 'react'
import LabelInput from '../LabelInput'
import PageTitle2 from '../PageTitle2'

function AnnouncementAddPopup(props:any) {
    return (
        props.add ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <PageTitle2 title='New Announcement' sectitle='announcement' />
                <form className='flex flex-col mt-6'>
                    <LabelInput id='title' title='Title' star='*' ex='' type='text' tag='input' />
                    <LabelInput id='description' title='Description' star='*' ex='' type='text' tag='textarea' />
                    <LabelInput id='image' title='Image' star='' ex='' type='text' tag='file' />
                    <div className='h-px bg-secblack my-2' />
                    <div className='flex justify-end mt-2'>
                        <input type="submit" value='Create' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default AnnouncementAddPopup