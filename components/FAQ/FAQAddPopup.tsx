import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MultiSelect } from 'react-multi-select-component'
import useSWR, { mutate } from 'swr'
import AlertError from '../AlertError'
import PageTitle2 from '../PageTitle2'

function FAQAddPopup(props:any) {
    const [problem, setProblem] = useState('')
    const [solution, setSolution] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [option, setOption] = useState([
        {label:'FS',value:'FS'},
        {label:'SS',value:'SS'},
        {label:'STUDENT',value:'STUDENT'}
    ])
    const [roles, setRoles] = useState([])

    useEffect(() => {
        setProblem('')
        setSolution('')
        setErrorMsg('')
        setRoles([])
    }, [props.add])

    async function addFAQHandler() {
        if(problem === '') {
            setErrorMsg('Problem must be filled')
        } else if(solution === '') {
            setErrorMsg('Solution must be filled')
        } else if(roles.length == 0) {
            setErrorMsg('Role must be choosen')
        }

        if(problem !== '' && solution !== '' && roles.length != 0) {
            let arr:any = []
            roles.map((role:any) => (
                arr.push(role.value)
            ))

            await fetch(process.env.BASE_URL + '/faq', {
                headers : { 
                    'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    categoryId: props.category.id,
                    problem: problem,
                    solution: solution,
                    target: arr
                })
            }).then(res => res.json())
            props.refetch(props.category.id)
        }
    }

    return (
        props.add ?
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-popupbg z-20' onClick={props.onClose}>
            <div className='sm:max-w-screen-sm lg:max-w-screen-xm w-full px-4 py-5 flex flex-col ml-auto mr-auto text-secblack bg-white rounded-md' onClick={(e) => e.stopPropagation()}>
                <PageTitle2 title='New FAQ' sectitle='FAQ' />
                <form className='flex flex-col mt-6'>
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
                        <textarea name='solution' id='solution' maxLength='500' rows="8" className='border border-gray-300 rounded-md px-3 py-1.5 outline-0 shadow-sm focus:ring-1 focus:border-blue text-smalltext' required onChange={(e) => setSolution(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label htmlFor='description' className='text-smalltext flex whitespace-pre-wrap break-all font-semibold text-gray-700 mb-1'>
                            Role <div className='text-red'>*</div>
                        </label>
                        <MultiSelect
                            options={option}
                            value={roles}
                            onChange={setRoles}
                            labelledBy="Please select role"
                        />
                    </div>
                    <div className='h-px bg-secblack my-2' />
                    {
                        errorMsg !== '' ? <AlertError title={errorMsg} onClose={() => setErrorMsg('')} /> : <></>
                    }
                    <div className='flex justify-end mt-2'>
                        <input type="button" value='Create' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' onClick={addFAQHandler} />
                    </div>
                </form>
            </div>
        </div>
        :
        <></>
    )
}

export default FAQAddPopup