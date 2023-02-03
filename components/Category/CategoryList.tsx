import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { RiDeleteBinLine } from '@react-icons/all-files/ri/RiDeleteBinLine'
import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import AlertLoading from '../AlertLoading'
import AlertNoData from '../AlertNoData'
import FAQAddPopup from '../FAQ/FAQAddPopup'
import FAQList from '../FAQ/FAQList'
import CategoryDeletePopup from './CategoryDeletePopup'
import CategoryEditPopup from './CategoryEditPopup'

const fetcher = (endpoint: RequestInfo | URL) =>fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer '+getCookie('ACCESS_TOKEN'),
        },
        method: 'GET',
    }).then(res => res.json())

function CategoryList(props:any) {
    const moment = require('moment')
    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)
    const [category, setCategory] = useState('')
    const [add, setAdd] = useState(false)
    const [endpoint, setEnpoint] = useState(process.env.BASE_URL+'/category')
    const {data, mutate:mutateData} = useSWR(endpoint, fetcher)

    function addHandler(category:any){
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
        setCategory(category)
    }

    const refetchEdit = async (categoryId:string) => {
        await mutateData()
        await mutate(process.env.BASE_URL+'/faq/faq-by-category/'+categoryId)
        setEdit(false)
    }

    const refetchDel = async () => {
        await mutateData()
        setDel(false)
    }

    useEffect(() => {
        if(props.bounceSearch != '') {
            setEnpoint(process.env.BASE_URL+'/category/search/'+props.bounceSearch)
        } else {
            setEnpoint(process.env.BASE_URL+'/category')
        }
    }, [props.bounceSearch])

    useEffect(() => {
        mutateData()
    }, [endpoint])

    return (
        <>
            <div className='flex flex-col'>
                {
                    !data ? <AlertLoading title='categories' /> : 
                        data.length === 0 ?
                        <AlertNoData title='category' />
                        :
                        data.map((category:any) => (
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