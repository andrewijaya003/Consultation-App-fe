import React from 'react'
import LabelInput from '../LabelInput'
import PageTitle2 from '../PageTitle2'

function FAQEditPopup(props:any) {
    return (
        props.edit ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <PageTitle2 title='Edit FAQ' sectitle='FAQ' />
                <form className='flex flex-col mt-6'>
                <LabelInput id='problem' title='Problem' star='*' ex='' type='text' tag='input' value={props.faq.problem} />
                <LabelInput id='solution' title='Solution' star='*' ex='' type='text' tag='textarea' value={props.faq.solution} />
                    <div className='h-px bg-secblack my-2' />
                    <div className='flex justify-end mt-2'>
                        <input type="submit" value='Edit' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default FAQEditPopup