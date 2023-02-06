import React, { useEffect, useState } from 'react'
import AlertError from '../AlertError'
import PageTitle2 from '../PageTitle2'
import { AiFillStar } from "@react-icons/all-files/ai/AiFillStar";
import { BsFillEmojiFrownFill, BsFillEmojiNeutralFill, BsFillEmojiSmileFill, BsFillEmojiLaughingFill, BsFillEmojiHeartEyesFill } from 'react-icons/bs'
import { getCookie } from 'cookies-next';
import { Router, useRouter } from 'next/router';

function RatingAddPopup(props:any) {
    const [description, setDescription] = useState('')
    const [advice, setAdvice] = useState('')
    const [image, setImage] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [one, setOne] = useState(false)
    const [two, setTwo] = useState(false)
    const [three, setThree] = useState(false)
    const [four, setFour] = useState(false)
    const [five, setFive] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setDescription('')
        setAdvice('')
        setImage('')
        setErrorMsg('')
    }, [props.add])

    async function addRatingHandler() {
        if(!one && !two && !three && !four && !five) {
            setErrorMsg('Rating must be filled')
        } else if(description == '') {
            setErrorMsg('Description must be filled')
        } else if(advice == '') {
            setErrorMsg('Advice must be filled')
        }

        if(one || two || three || four || five) {
            let ratingNumber

            if(five) {
                ratingNumber = 5
            } else if(four) {
                ratingNumber = 4
            } else if(three) {
                ratingNumber = 3
            } else if(two) {
                ratingNumber = 2
            } else if(one) {
                ratingNumber = 1
            }

            await fetch(process.env.BASE_URL + '/rating', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    "Content-Type" : "application/json"
                },
                method: 'POST',
                body: JSON.stringify({
                    roomId: props.roomChatId,
                    ratingNumber: ratingNumber,
                    ratingDescription: description,
                    advice: advice
                })
            }).then((res) => res.json())
            
            await props.resetRoomChatData()
            await  props.mutateRoomChat(undefined)
            await props.refetch()
            await router.push('/home')
        }
    }

    function oneHandler() {
        setOne(true)
        setTwo(false)
        setThree(false)
        setFour(false)
        setFive(false)
    }

    function twoHandler() {
        setOne(false)
        setTwo(true)
        setThree(false)
        setFour(false)
        setFive(false)
    }

    function threeHandler() {
        setOne(false)
        setTwo(false)
        setThree(true)
        setFour(false)
        setFive(false)
    }

    function fourHandler() {
        setOne(false)
        setTwo(false)
        setThree(false)
        setFour(true)
        setFive(false)
    }

    function fiveHandler() {
        setOne(false)
        setTwo(false)
        setThree(false)
        setFour(false)
        setFive(true)
    }

    return (
        props.add ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <div className='px-4'>
                    <PageTitle2 title='Insert Rating' sectitle='rating' />
                </div>
                <form className='flex flex-col mt-6 max-h-[420px] display-scrollbar px-4'>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Description <div className='text-red'>*</div>
                        </label>
                        <input name='description' id='description' type='text' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' onChange={(e) => setDescription(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='advice' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Advice <div className='text-red'>*</div>
                        </label>
                        <textarea name='advice' id='advice' maxLength={500} rows={8} className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' onChange={(e) => setAdvice(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='rating' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Rating <div className='text-red'></div>
                        </label>
                        <ul className="flex items-center gap-x-1">
                            <li className='hover:cursor-pointer' onClick={() => oneHandler()}>
                                <BsFillEmojiFrownFill size={30} color={one ? 'red' : 'gray'} className="text-yellow-300" />
                                {/* <AiFillStar size={30} color={one ? '#00a9e2' : 'gray'} className="text-yellow-300" /> */}
                            </li>
                            <li className='hover:cursor-pointer' onClick={() => twoHandler()}>
                                <BsFillEmojiNeutralFill size={30} color={two ? 'green' : 'gray'} className="text-yellow-300" />
                                {/* <AiFillStar size={30} color={two ? '#00a9e2' : 'gray'} className="text-yellow-300" /> */}
                            </li>
                            <li className='hover:cursor-pointer' onClick={() => threeHandler()}>
                                <BsFillEmojiSmileFill size={30} color={three ? '#ffc549' : 'gray'} className="text-yellow-300" />
                                {/* <AiFillStar size={30} color={three ? '#00a9e2' : 'gray'} className="text-yellow-300" /> */}
                            </li>
                            <li className='hover:cursor-pointer' onClick={() => fourHandler()}>
                                <BsFillEmojiLaughingFill size={30} color={four ? 'purple' : 'gray'} className="text-yellow-300" />
                                {/* <AiFillStar size={30} color={four ? '#00a9e2' : 'gray'} className="text-yellow-300" /> */}
                            </li>
                            <li className='hover:cursor-pointer' onClick={() => fiveHandler()}>
                                <BsFillEmojiHeartEyesFill size={30} color={five ? '#00a9e2' : 'gray'} className="text-yellow-300" />
                                {/* <AiFillStar size={30} color={five ? '#00a9e2' : 'gray'} className="text-yellow-300" /> */}
                            </li>
                        </ul>
                    </div>
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2 border-t-2 border-secblack'>
                        <input type="button" value='Insert' className='bg-blue mt-2 text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={() => addRatingHandler()} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default RatingAddPopup