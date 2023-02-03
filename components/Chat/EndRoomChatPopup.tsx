import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import AlertError from '../AlertError'
import PageTitle2 from '../PageTitle2'

function EndRoomChatPopup(props:any) {
    const [problem, setProblem] = useState('')
    const [solution, setSolution] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        fetch(process.env.BASE_URL + '/room-chat/'+props.room?.id, {
            headers : { 
                'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                'Content-type': 'application/json'
            },
            method: 'GET',
        }).then(res => res.json()).then(data => {
            setProblem(data.problem)
            setSolution(data.solution)
        })
        setErrorMsg('')
    }, [props.endRoomChatPopup])

    async function resolveHandler() {
        if(problem == '') {
            setErrorMsg('Problem must be filled')
        } else if(solution == '') {
            setErrorMsg('Solution must be filled')
        }

        if(problem !== '' && solution !== '' ) {
            await fetch(process.env.BASE_URL + '/room-chat', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({
                    id: props.room.id,
                    problem: problem,
                    solution: solution
                })
            }).then((res) => res.json()).then((data) => {
                props.onClose()
            })
        }
    }
    
    return (
        props.endRoomChatPopup ?
            props.room?.problem != null ?
            <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
                <div className={`sm:max-w-screen-sm lg:max-w-screen-xm w-full py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md max-h-screen`} onClick={(e) => e.stopPropagation()}>
                    <div className='px-4'>
                        <PageTitle2 title='Update Room Chat' sectitle='room chat' />
                    </div>
                    <form className='flex flex-col mt-6 max-h-[420px] display-scrollbar px-4'>
                        <div className='flex flex-col mb-6'>
                            <label htmlFor='problem' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                                Problem <div className='text-red'>*</div>
                            </label>
                            <input value={problem} name='problem' id='problem' type='text' className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setProblem(e.target.value)} /> 
                        </div>
                        <div className='flex flex-col mb-6'>
                            <label htmlFor='solution' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                                Solution <div className='text-red'>*</div>
                            </label>
                            <textarea value={solution} name='solution' id='solution' maxLength={500} rows={8} className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setSolution(e.target.value)} />
                        </div>
                        {
                            errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                        }
                        <div className='flex justify-end mt-2  border-t-2 border-secblack'>
                            <input type="button" value='Update' className='bg-blue text-white text-normal mt-2 font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={resolveHandler} />
                        </div>
                    </form>
                </div>
            </div>
            :
            <></>
            :
        <></>
    )
}

export default EndRoomChatPopup