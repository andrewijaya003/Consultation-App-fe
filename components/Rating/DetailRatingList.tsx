import React, { useEffect } from 'react'
import { BsFillEmojiFrownFill, BsFillEmojiHeartEyesFill, BsFillEmojiLaughingFill, BsFillEmojiNeutralFill, BsFillEmojiSmileFill } from 'react-icons/bs'

function DetailRatingList(props:any) {
    const moment = require('moment')

    return (
        <div className='w-full flex flex-col border border-gray-300 rounded-lg px-3.5 py-3 mb-6 bg-white shadow-xm'>
            <div className='text-start mb-2 text-[19px] font-bold whitespace-pre-wrap break-word'>
                FROM {props.detail.clientName} - {props.detail.clientRole.toUpperCase()}
            </div>
            <div className='text-smalltext font-bold '>
                Problem in chat:
            </div>
            <div className='text-normal white-pre-wrap break-words mb-0.5'>
                { props.detail.problem }
            </div>
            <div className='text-smalltext font-bold mt-2.5 '>
                Solution in chat:
            </div>
            <div className='text-normal white-pre-wrap break-words mb-8'>
                { props.detail.solution }
            </div>
            <div className='text-smalltext font-bold '>
                Rating description from user:
            </div>
            <div className='text-normal white-pre-wrap break-words mb-0.5'>
                { props.detail.description }
            </div>
            <div className='text-smalltext font-bold mt-2.5 '>
                Advice from user:
            </div>
            <div className='text-normal white-pre-wrap break-words mb-0.5'>
                { props.detail.advice }
            </div>
            <div className='flex flex-col'>
                <label htmlFor='rating' className='text-smalltext font-bold mt-2.5 '>
                    Rating: 
                </label>
                {/* <ul className="flex items-center gap-x-1">
                    <li>
                        <BsFillEmojiFrownFill size={props.detail.rating == 1 ? 40 : 30} color={props.detail.rating == 1 ? '#00a9e2' : 'gray'} className="text-yellow-300" />
                    </li>
                    <li>
                        <BsFillEmojiNeutralFill size={props.detail.rating == 2 ? 40 : 30} color={props.detail.rating == 2 ? '#00a9e2' : 'gray'} className="text-yellow-300" />
                    </li>
                    <li>
                        <BsFillEmojiSmileFill size={props.detail.rating == 3 ? 40 : 30} color={props.detail.rating == 3 ? '#00a9e2' : 'gray'} className="text-yellow-300" />
                    </li>
                    <li>
                        <BsFillEmojiLaughingFill size={props.detail.rating == 4 ? 40 : 30} color={props.detail.rating == 4 ? '#00a9e2' : 'gray'} className="text-yellow-300" />
                    </li>
                    <li>
                        <BsFillEmojiHeartEyesFill size={props.detail.rating == 5 ? 40 : 30} color={props.detail.rating == 5 ? '#00a9e2' : 'gray'} className="text-yellow-300" />
                    </li>
                </ul> */}
                <div className='flex md:flex-row flex-col justify-between md:items-center'>
                    {
                        props.detail.rating == 1 ? 
                        <div className='flex items-center'>
                            <BsFillEmojiFrownFill size={30} color={props.detail.rating == 1 ? 'red' : 'gray'} className="text-yellow-300" /> 
                            <div className='ml-2 text-[14.3px] font-bold'>{props.detail.rating}/5</div>
                        </div>
                        :
                        props.detail.rating == 2 ?
                        <div className='flex items-center'>
                            <BsFillEmojiNeutralFill size={30} color={props.detail.rating == 2 ? 'green' : 'gray'} className="text-yellow-300" />
                            <div className='ml-2 text-[14.3px] font-bold'>{props.detail.rating}/5</div>
                        </div>
                        :
                        props.detail.rating == 3 ?
                        <div className='flex items-center'>
                            <BsFillEmojiSmileFill size={30} color={props.detail.rating == 3 ? '#ffc549' : 'gray'} className="text-yellow-300" />
                            <div className='ml-2 text-[14.3px] font-bold'>{props.detail.rating}/5</div>
                        </div>
                        :
                        props.detail.rating == 4 ?
                        <div className='flex items-center'>
                            <BsFillEmojiLaughingFill size={30} color={props.detail.rating == 4 ? 'purple' : 'gray'} className="text-yellow-300" />
                            <div className='ml-2 text-[14.3px] font-bold'>{props.detail.rating}/5</div>
                        </div>
                        :
                        props.detail.rating == 5 ?
                        <div className='flex items-center'>
                            <BsFillEmojiHeartEyesFill size={30} color={props.detail.rating == 5 ? '#00a9e2' : 'gray'} className="text-yellow-300" />
                            <div className='ml-2 text-[14.3px] font-bold'>{props.detail.rating}/5</div>
                        </div>
                        :
                        <></>
                    }
                    <div className='text-end text-tinytext text-gray-400'>
                        { moment(props.detail?.startTime).format('DD MMMM YYYY, hh:mm')+ ' - '+ moment(props.detail?.endTime).format('DD MMMM YYYY, hh:mm') }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailRatingList