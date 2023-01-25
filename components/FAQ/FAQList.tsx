import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { RiDeleteBinLine } from '@react-icons/all-files/ri/RiDeleteBinLine'
import { MdCancel } from '@react-icons/all-files/md/MdCancel'
import React, { useEffect, useState } from 'react'
import FAQAddPopup from './FAQAddPopup'
import FAQDeletePopup from './FAQDeletePopup'
import FAQEditPopup from './FAQEditPopup'
import AlertNoData from '../AlertNoData'
import { getCookie } from 'cookies-next'
import AlertLoading from '../AlertLoading'
import useSWR from 'swr'

const fetcher = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function FAQList(props:any) {
    const moment = require('moment')
    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)
    const [faq, setFAQ] = useState('')
    const [endpoint, setEndpoint] = useState(process.env.BASE_URL+'/faq/faq-by-category/'+props.categoryId)
    const {data, mutate} = useSWR(endpoint, fetcher)

    useEffect(() => {
        console.log(data)
    }, [data])

    function editHandler(faq:any){
        setEdit(true)
        setFAQ(faq)
    }

    function deleteHandler(faq:any){
        setDel(true)
        setFAQ(faq)
    }

    const refetchEdit = async () => {
        await mutate()
        setEdit(false)
    }

    const refetchDel = async () => {
        await mutate()
        setDel(false)
    }
    
    return (
        <>
            <div className='flex flex-col w-full'>
                {
                    !data ? 
                    <AlertLoading title='FAQS' />
                    : 
                        data.length === 0 ? 
                        <AlertNoData title='FAQ' />
                        :
                        data.map((faq:any) => (
                            <div className='flex flex-col border border-gray-300 rounded-lg px-3.5 py-3 mb-6 bg-white shadow-xm'>
                                <div className='flex justify-between w-full'>
                                    <div className='text-smalltext font-bold mb-0.5'>
                                        Problem:
                                    </div>
                                    <div className='flex text-end text-tinytext text-gray-400 h-fit whitespace-pre-wrap'>
                                        Posted for
                                        {
                                            faq.target.map((role:any, index:BigInteger) => (
                                                <div className='font-bold'>
                                                    {
                                                        index == 0 ? 
                                                        ' '+role
                                                        :
                                                        ', '+role
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className='text-normal white-pre-wrap break-words'>
                                    { faq.problem }
                                </div>
                                <div className='text-smalltext font-bold mt-2.5 mb-0.5'>
                                    Solution:
                                </div>
                                <div className='text-normal white-pre-wrap break-words'>
                                    { faq.solution }
                                </div>
                                {
                                    getCookie('ROLE') === 'STAFF' ?
                                    <>
                                        <div className='text-tinytext text-gray-400 mt-4'>
                                            Updated by { faq.updatedByStaff != null ? faq.updatedByStaff.name : "Admin" } on { moment(faq.lastUpdatedTime).format('DD MMMM YYYY') }
                                        </div>
                                        <div className="flex text-end w-full mt-2 text-smalltext font-bold ">
                                            <div className='flex py-2 px-4 rounded bg-yellow items-center text-white mr-3 hover:cursor-pointer' onClick={() => editHandler(faq)}>
                                                <FiEdit2 className='text-smalltitle mr-1.5' />
                                                Edit
                                            </div>
                                            <div className='flex py-2 px-4 rounded bg-red items-center text-white hover:cursor-pointer' onClick={() => deleteHandler(faq)}>
                                                <RiDeleteBinLine className='text-smalltitle mr-1.5' />
                                                Delete
                                            </div>
                                        </div>
                                    </> : <></>
                                }
                            </div>
                        ))
                }
            </div>
            {
                getCookie('ROLE') === 'STAFF' ?
                <>
                    <FAQEditPopup faq={faq} edit={edit} onClose={() => setEdit(false)} refetch={refetchEdit} />
                    <FAQDeletePopup faq={faq} del={del} onClose={() => setDel(false)} refetch={refetchDel} />
                </> : <></>
            }
        </>
    )
}

export default FAQList