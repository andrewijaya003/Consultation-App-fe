import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { RiDeleteBinLine } from '@react-icons/all-files/ri/RiDeleteBinLine'
import React, { useEffect, useState } from 'react'
import { mutate } from 'swr'
import AlertNoData from '../AlertNoData'
import FAQAddPopup from '../FAQ/FAQAddPopup'
import FAQList from '../FAQ/FAQList'
import CategoryDeletePopup from './CategoryDeletePopup'
import CategoryEditPopup from './CategoryEditPopup'

function CategoryList(props:any) {
    const moment = require('moment')
    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)
    const [category, setCategory] = useState('')
    const [add, setAdd] = useState(false)

    function addHandler(category:any){
        console.log(category)
        setAdd(true)
        setCategory(category)
    }

    function editHandler(category:any){
        setEdit(true)
        setCategory(category)
    }

    function deleteHandler(category:any){
        setDel(true)
        setCategory(category)
    }

    const refetchAdd = async (categoryId:string) => {
        await mutate(process.env.BASE_URL+'/faq/faq-by-category/'+categoryId)
        setAdd(false)
    }

    const refetchEdit = async () => {
        await mutate(props.endpoint)
        setEdit(false)
    }

    const refetchDel = async () => {
        await mutate(props.endpoint)
        setDel(false)
    }

    return (
        <>
            <div className='flex flex-col'>
                {
                    props.categories.length === 0 ?
                    <AlertNoData title='category' />
                    :
                    props.categories.map((category:any) => (
                        <div className='text-secblack flex sm:flex-col w-full lg:flex-row sm:items-center lg:items-start border border-gray-300 rounded-lg px-6 py-5 mb-6 bg-white shadow-xm'>
                            <div className='flex flex-col w-full'>
                                <div className='flex sm: w-full justify-between items-center mb-4'>
                                    <div className='flex flex-col'>
                                        <div className='text-normal font-bold'>
                                            { category.category }
                                        </div>
                                        <div className='h-0.5 bg-secblack my-1'></div>
                                    </div>
                                    <div className='flex justify-end' onClick={() => addHandler(category)}>
                                        <input type="button" value='Insert FAQ' className='bg-blue text-white text-smalltext font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                                    </div>
                                </div>
                                <FAQList categoryId={category.id} />
                                <div className='text-end text-tinytext text-gray-400 mt-4'>
                                    Updated by { category.updatedByStaff != null ? category.updatedByStaff.name : 'Admin' } on { moment(category.lastUpdatedTime).format('DD MMMM YYYY') }
                                </div>
                                <div className="text-end text-smalltext font-bold flex w-full justify-end mt-2">
                                    <div className='flex py-2 px-4 rounded bg-yellow items-center text-white mr-3 hover:cursor-pointer' onClick={() => editHandler(category)}>
                                        <FiEdit2 className='text-smalltitle mr-1.5' />
                                        Update
                                    </div>
                                    <div className='flex py-2 px-4 rounded bg-red items-center text-white hover:cursor-pointer' onClick={() => deleteHandler(category)}>
                                        <RiDeleteBinLine className='text-smalltitle mr-1.5' />
                                        Delete
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <FAQAddPopup category={category} add={add} onClose={() => setAdd(false)} refetch={refetchAdd} />
            <CategoryEditPopup category={category} edit={edit} onClose={() => setEdit(false)} refetch={refetchEdit} />
            <CategoryDeletePopup category={category} del={del} onClose={() => setDel(false)} refetch={refetchDel} />
        </>
    )
}


export default CategoryList