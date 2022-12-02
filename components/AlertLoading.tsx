import {BsFillInfoCircleFill} from '@react-icons/all-files/bs/BsFillInfoCircleFill'
import React from 'react'
import ReactLoading from 'react-loading';

function AlertLoading(props:any) {
    return (
        <div className='flex w-full rounded-lg px-3.5 py-3 mb-6 bg-white shadow-xm bg-[#bfdbfe]'>
            <div className='text-[#2196f3] mr-3 text-normaltitle hover:cursor-pointer'>
                <BsFillInfoCircleFill />
            </div>
            <div className='flex flex-col w-full'>
                <div className='text-[#1e40af] text-normal font-bold'>
                    Loading for fetching {props.title}
                </div>
                <ReactLoading type={'bubbles'} color={'#00a9e2'} width={40} height={30} /> 
            </div>
        </div>
    )
}

export default AlertLoading