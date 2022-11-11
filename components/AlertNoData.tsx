import { MdCancel } from '@react-icons/all-files/md/MdCancel'
import React from 'react'

function AlertNoData(props:any) {
    return (
        <div className='flex w-full rounded-lg px-3.5 py-3 mb-6 bg-white shadow-xm bg-pink'>
            <div className='text-red mr-3 text-normaltitle'>
                <MdCancel />
            </div>
            <div className='flex flex-col w-full'>
                <div className='text-redblack text-normal font-bold'>
                    Alert
                </div>
                <div className='text-smalltext text-red'>
                    There is no available data for {props.title}.
                </div>
            </div>
        </div>
    )
}

export default AlertNoData