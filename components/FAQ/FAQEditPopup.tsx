import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AlertError from '../AlertError'
import LabelInput from '../LabelInput'
import PageTitle2 from '../PageTitle2'

function FAQEditPopup(props:any) {
    const [id, setId] = useState('')
    const [problem, setProblem] = useState('')
    const [solution, setSolution] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    useEffect(() => {
        if(props.faq !== undefined) {
            setId(props.faq.id)
            setProblem(props.faq.problem)
            setSolution(props.faq.solution)
        }
    }, [props.faq])

    async function editFAQHandler() {
        if(problem === '') {
            setErrorMsg('Problem must be filled')
        } else if(solution === '') {
            setErrorMsg('Solution must be filled')
        }

        if(problem !== '' && solution !== '') {
            await fetch(process.env.BASE_URL + '/faq', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({
                    id: id,
                    problem: problem,
                    solution: solution
                })
            }).then(res => res.json())
            .then(() => router.reload())
        }

        
    }

    return (
        props.edit ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <PageTitle2 title='Edit FAQ' sectitle='FAQ' />
                <form className='flex flex-col mt-6'>
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
                        <textarea value={solution} name='solution' id='solution' maxLength='500' rows="8" className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setSolution(e.target.value)} />
                    </div>
                    <div className='h-px bg-secblack my-2' />
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2'>
                        <input type="button" value='Edit' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={editFAQHandler} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default FAQEditPopup