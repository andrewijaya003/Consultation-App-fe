import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import PageTitle2 from '../PageTitle2'
import AlertNoData from '../AlertNoData';
import AlertError from '../AlertError';
import useSWR, {mutate} from 'swr';
import useSWRMutation from 'swr'
import { MultiSelect } from "react-multi-select-component";
import { BiChevronDown } from 'react-icons/bi';

const fetcher = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function ResolveChat(props:any) {
    const [problem, setProblem] = useState('')
    const [solution, setSolution] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [categories, setCategories] = useState([]);
    const [endpoint, setEndpoint] = useState(process.env.BASE_URL + '/category')
    const {data:optionCategories, mutate} = useSWR(endpoint, fetcher)
    const [option, setOption] = useState([])
    const [categoryIds, setCategoryIds] = useState([])
    const [showDP, setShowDP] = useState(false)
    const [status, setStatus] = useState('')

    useEffect(() => {
        let arr:any = []
        for(let i = 0; i < categories.length; i++) {
            arr.push(categories[i].value)
        }
        setCategoryIds(arr)
    }, [categories])

    useEffect(() => {
        if(optionCategories) {
            let arr:any = []
            for(let i = 0; i < optionCategories.length; i++) {
                const obj = {label: optionCategories[i].category, value: optionCategories[i].id}
                arr.push(obj)
            }
            setOption(arr)
        }
    }, [optionCategories])

    useEffect(() => {
        setProblem('')
        setSolution('')
        setCategories([])
        setStatus('')
        setErrorMsg('')
    }, [props.resolve])

    async function resolveHandler() {
        if(problem == '') {
            setErrorMsg('Problem must be filled')
        } else if(solution == '') {
            setErrorMsg('Solution must be filled')
        } else if(categories.length == 0) {
            setErrorMsg('Please select category')
        } else if(status == '') {
            setErrorMsg('Please select status')
        }

        if(problem !== '' && solution !== '' && categories.length !== 0 && status != '') {
            await fetch(process.env.BASE_URL + '/room-chat', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({
                    id: props.roomChatId,
                    endTime: new Date(),
                    problem: problem,
                    solution: solution,
                    status: status.toUpperCase(),
                    categoryIds: categoryIds
                })
            }).then((res) => res.json()).then((data) => {
                props.socket.emit('notify-room-status-change', {message: data})
                console.log('masuk nih')
                props.refetch()
                props.resetUserId()
                props.onClose()
            })
        }
    }

    function statusHandler(str:string) {
        setStatus(str)
        setShowDP(!showDP)
    }

    return (
        props.resolve ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <div className='px-4'>
                    <PageTitle2 title='End Room Chat' sectitle='room chat' />
                </div>
                <form className='flex flex-col mt-6 max-h-[420px] display-scrollbar px-4'>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='problem' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Problem <div className='text-red'>*</div>
                        </label>
                        <input name='problem' id='problem' type='text' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setProblem(e.target.value)} /> 
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='solution' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Solution <div className='text-red'>*</div>
                        </label>
                        <textarea name='solution' id='solution' maxLength={500} rows={8} className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setSolution(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='categories' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Categories <div className='text-red'>*</div>
                        </label>
                        <MultiSelect
                            options={option}
                            value={categories}
                            onChange={setCategories}
                            labelledBy="Please select category"
                        />
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor="category" className="text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1">
                            Status <div className='text-red'>*</div>
                        </label>
                        <div id='category' className='relative text-smalltext'>
                            <div className={`flex items-center justify-between border border-gray-300 rounded-md px-1.5 py-2 outline-0 shadow-sm ${showDP ? 'ring-1 border-blue' : ''} hover:cursor-pointer`} onClick={() => setShowDP(!showDP)}>
                                <div className='px-1.5'>
                                    {status === '' ? 'Choose status' : status}
                                </div>
                                <BiChevronDown size={23} />
                            </div>
                            <div className={`${showDP ? 'absolute' : 'hidden'} w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer z-2 bg-white`}>
                                <div className='hover:bg-gray-300 px-3 py-2' onClick={() => statusHandler('Closed')}>
                                    Closed
                                </div>  
                                <div className='hover:bg-gray-300 px-3 py-2' onClick={() => statusHandler('Done')}>
                                    Done
                                </div>  
                            </div>
                        </div>
                    </div>
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2 border-t-2 border-secblack'>
                        <input type="button" value='End' className='bg-blue text-white text-normal font-semibold rounded mt-2 px-4 py-1.5 hover:cursor-pointer' onClick={resolveHandler} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default ResolveChat