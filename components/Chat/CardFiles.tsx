import React, { useEffect } from 'react' 
import { AiOutlineFolder } from '@react-icons/all-files/ai/AiOutlineFolder'

function CardFiles(props:any) {
    return (
        <div className='w-full flex justify-start items-center p-6'>
            <div className='flex w-full justify-between'>
                <div className='flex justify-start items-center'>
                    {
                        props.fileExt.match('image.*') ? 
                        <img src={props.src} alt="" className='w-16 h-16 mr-3 object-contain' />
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
    )
}

export default CardFiles