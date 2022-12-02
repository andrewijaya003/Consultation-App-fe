import { MdCancel } from '@react-icons/all-files/md/MdCancel'
import React from 'react'

function AlertError(props:any) {
    return (
        <div className='flex w-full rounded-lg px-2 py-2 bg-white shadow-xm bg-pink'>
            <div className='text-red mr-3 text-normaltitle hover:cursor-pointer' onClick={props.onClose}>
                <MdCancel />
            </div>
            <div className='flex flex-col w-full'>
                <div className='text-redblack text-smalltext font-bold'>
                    Alert
                </div>
                <div className='text-tinytext text-red'>
                    {props.title}.
                </div>
            </div>
        </div>
    )
}

export default AlertError