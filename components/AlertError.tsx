import { ImCross } from '@react-icons/all-files/im/ImCross'
import { MdCancel } from '@react-icons/all-files/md/MdCancel'
import React from 'react'

function AlertError(props:any) {
    return (
        <div className='flex w-full rounded-lg px-3.5 py-2 bg-white shadow-xm bg-pink'>
            <div className='text-red mr-3 text-normaltitle hover:cursor-pointer'>
                <MdCancel />
            </div>
            <div className='flex w-full justify-between items-center'>
                <div className='flex flex-col w-full'>
                    <div className='text-redblack text-smalltext font-bold'>
                        Error
                    </div>
                    <div className='text-tinytext text-red'>
                        {props.title}.
                    </div>
                </div>
                <ImCross size={10} color='#a12f4b' className='hover:cursor-pointer' onClick={props.onClose} />
            </div>
        </div>
    )
}

export default AlertError