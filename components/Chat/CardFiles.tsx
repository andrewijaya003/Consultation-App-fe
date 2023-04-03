import React, { useEffect, useState } from 'react' 
import { AiOutlineFolder } from '@react-icons/all-files/ai/AiOutlineFolder'
import AlertError from '../AlertError'
import { MdCancel } from '@react-icons/all-files/md/MdCancel'

function CardFiles(props:any) {
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
    }, [props.src])

    useEffect(() => {
        if(props.fileSize > 10000000) {
            setErrorMsg(props.fileName + ' to large')
        } else {
            setErrorMsg('')
        }
    }, [props.fileSize])

    return (
        props.fileSize < 10000000 ? 
        <div className='w-full flex justify-start items-center p-3.5'>
            <div className='flex w-full justify-between'>
                <div className='flex justify-start items-center'>
                    {
                        props.fileExt.match('image.*') ? 
                        <img src={URL.createObjectURL(props.src)} alt="" className='w-16 h-16 mr-3 object-contain' />
                        :
                        <div className='w-16 h-16 mr-3 object-contain flex justify-center'>
                            <AiOutlineFolder size={50} color='#222222' />
                        </div>
                    }
                    <div className='flex flex-col'>
                        <div className='text-smalltext'>
                            {props.fileName}
                        </div>
                        <div className='text-tinytext text-gray-500 mt-0.5'>
                            {(props.fileSize/1024).toFixed(0)+'KB'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        :
        <div className='w-full flex justify-start items-center p-3.5'>
            <div className='flex w-full rounded-lg px-5 py-3 bg-white shadow-xm bg-pink'>
                <div className='text-red mr-3 text-normaltitle hover:cursor-pointer'>
                    <MdCancel />
                </div>
                <div className='flex w-full justify-between items-center'>
                    <div className='flex flex-col w-full'>
                        <div className='text-redblack text-smalltext font-bold'>
                            Error
                        </div>
                        <div className='text-tinytext text-red'>
                            {errorMsg}.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardFiles