import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { RiDeleteBinLine } from '@react-icons/all-files/ri/RiDeleteBinLine'
import { MdCancel } from '@react-icons/all-files/md/MdCancel'
import React, { useState } from 'react'
import FAQAddPopup from './FAQAddPopup'
import FAQDeletePopup from './FAQDeletePopup'
import FAQEditPopup from './FAQEditPopup'
import AlertNoData from '../AlertNoData'

function FAQList(props:any) {
    const moment = require('moment')
    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)
    const [faq, setFAQ] = useState('')
    // const faqs = props.faqs.filter((faq:any) => faq.categoryId == props.category.id)

    function editHandler(faq:any){
        setEdit(true)
        setFAQ(faq)
    }

    function deleteHandler(faq:any){
        setDel(true)
        setFAQ(faq)
    }
    
    return (
        <>
            <div className='flex flex-col w-full'>
                {
                    props.faqs.length === 0 ? 
                    <AlertNoData title='FAQ' />
                    :
                    props.faqs.map((faq:any) => (
                        <div className='flex flex-col border border-gray-300 rounded-lg px-3.5 py-3 mb-6 bg-white shadow-xm'>
                            <div className='text-smalltext font-bold mb-0.5'>
                                Problem:
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
                            <div className='text-tinytext text-gray-400 mt-4'>
                                Updated by { faq.updatedBy } on { moment(faq.lastUpdate).format('DD MMMM YYYY') }
                            </div>
                            <div className="text-end text-smalltext font-bold flex w-full mt-2">
                                <div className='flex py-2 px-4 rounded bg-yellow items-center text-white mr-3 hover:cursor-pointer' onClick={() => editHandler(faq)}>
                                    <FiEdit2 className='text-smalltitle mr-1.5' />
                                    Edit
                                </div>
                                <div className='flex py-2 px-4 rounded bg-red items-center text-white hover:cursor-pointer' onClick={() => deleteHandler(faq)}>
                                    <RiDeleteBinLine className='text-smalltitle mr-1.5' />
                                    Delete
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <FAQEditPopup faq={faq} edit={edit} onClose={() => setEdit(false)} />
            <FAQDeletePopup faq={faq} del={del} onClose={() => setDel(false)} />
        </>
    )
}

export default FAQList