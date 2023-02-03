import { count } from 'console'
import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'
import AlertLoading from '../components/AlertLoading'
import AlertNoData from '../components/AlertNoData'
import BarChart from '../components/Chart/BarChart'
import DetailRatingList from '../components/Rating/DetailRatingList'

function rating() {
    const [add, setAdd] = useState(false)
    const [searchYear, setSearchYear] = useState()
    const [searchMonth, setSearchMonth] = useState()
    const [range, setRange] = useState<number[]>()
    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const [endpointRating, setEndpointRating] = useState(process.env.BASE_URL + '/rating/rating-by-year')
    const {data:rating, mutate:ratingMutate} = useSWR(endpointRating, 
        () => fetch(endpointRating, {
            headers : { 
                'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                year: year
            })
        }).then(res => res.json())    
    )
    const [averageRating, setAverageRating] = useState({
        labels: [],
        datasets: [
            {
                label: 'Average Rating Line',
                data: [],
                backgroundColor: ['#00a9e2'],
                borderColor: ['#00a9e2']
            }, {
                label: 'Average Rating Filled',
                data: [],
                backgroundColor: ['#00a9e2'],
                borderColor: ['#00a9e2'],
                fill: true
            }
        ]
    })
    const [labels, setLabels] = useState(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
    const [bounceYear] = useDebounce(year, 1000)
    const [endpointDetailRating, setEndpointDetailRating] = useState(process.env.BASE_URL + '/rating/rating-detail-by-month')
    const {data:detailRating, mutate:detailRatingaMutate} = useSWR(endpointDetailRating, 
        () => fetch(endpointDetailRating, {
            headers : { 
                'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                year: year,
                month: month
            })
        }).then(res => res.json())    
    )
    const [endpointCountStatus, setEndpointCountStatus] = useState(process.env.BASE_URL + '/room-chat/status-count-per-month')
    const {data:countStatus, mutate:countStatusaMutate} = useSWR(endpointCountStatus, 
        () => fetch(endpointCountStatus, {
            headers : { 
                'Authorization': 'Bearer '+getCookie("ACCESS_TOKEN"),
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                year: year,
                month: month
            })
        }).then(res => res.json())    
    )
    const [bounceMonth] = useDebounce(month, 1000)
    const [showDP, setShowDP] = useState(false)

    useEffect(() => {
        console.log(countStatus)
    }, [countStatus])

    useEffect(() => {
        if(rating) {
            let arrAvg:any = []
            let arrMonth:string[] = []
            for(let i = 0; i < 12; i++) {
                if(rating[i]?.averageRating == undefined || rating[i]?.averageRating == null) {
                    arrAvg.push(0)
                } else {
                    arrAvg.push(rating[i].averageRating)
                }
            }
            setAverageRating({
                labels: labels,
                datasets: [
                    {
                        label: 'Average Rating Line',
                        data: arrAvg,
                        backgroundColor: ['#00a9e2'],
                        borderColor: ['#00a9e2']
                    }, {
                        label: 'Average Rating Filled',
                        data: arrAvg,
                        backgroundColor: ['#4bc0c0'],
                        borderColor: ['#4bc0c0'],
                        fill: true
                    }
                ]
            })
        }
    }, [rating])
    
    function addHandler(){
        setAdd(true)
    }

    function searchHandlerYear(value:string){
        setSearchYear(value)
    }

    function searchHandlerMonth(value:string){
        setSearchMonth(value)
        setShowDP(!showDP)
    }

    useEffect(() => {
        if(searchYear == undefined || searchYear == null || searchYear == '') {
            setYear(new Date().getFullYear())
        } else {
            setYear(parseInt(searchYear))
        }
    }, [searchYear])

    useEffect(() => {
        if(searchMonth == undefined || searchMonth == null || searchMonth == '') {
            setMonth(new Date().getMonth())
        } else {
            if(searchMonth.toLocaleLowerCase() == 'january') {
                setMonth(1)
            } else if(searchMonth.toLocaleLowerCase() == 'february') {
                setMonth(2)
            } else if(searchMonth.toLocaleLowerCase() == 'march') {
                setMonth(3)
            } else if(searchMonth.toLocaleLowerCase() == 'april') {
                setMonth(4)
            } else if(searchMonth.toLocaleLowerCase() == 'may') {
                setMonth(5)
            } else if(searchMonth.toLocaleLowerCase() == 'june') {
                setMonth(6)
            } else if(searchMonth.toLocaleLowerCase() == 'july') {
                setMonth(7)
            } else if(searchMonth.toLocaleLowerCase() == 'august') {
                setMonth(8)
            } else if(searchMonth.toLocaleLowerCase() == 'september') {
                setMonth(9)
            } else if(searchMonth.toLocaleLowerCase() == 'october') {
                setMonth(10)
            } else if(searchMonth.toLocaleLowerCase() == 'november') {
                setMonth(11)
            } else if(searchMonth.toLocaleLowerCase() == 'december') {
                setMonth(12)
            }
        }
    }, [searchMonth])

    useEffect(() => {
        console.log(month)
    }, [month])

    useEffect(() => {
        console.log(year)
    }, [year])

    useEffect(() => {
        ratingMutate()
        detailRatingaMutate()
        countStatusaMutate()
    }, [bounceYear])

    useEffect(() => {
        detailRatingaMutate()
        countStatusaMutate()
    }, [bounceMonth])

    useEffect(() => {
        console.log(detailRating)
    }, [detailRating])
    
    
    return (
        <div className='max-w-screen-xl w-full px-4 py-5 flex flex-col ml-auto mr-auto'>
            {/* PageTitle Start */}
            <div className='flex flex-col w-full mb-6 text-secblack'>
                <div className='flex flex-wrap w-full justify-between items-center'>
                    <div className='flex flex-col'>
                        <div className='text-normaltitle font-bold'>
                            Ratings
                        </div>
                        <div className='h-0.5 bg-secblack my-2'></div>
                    </div>
                </div>
                <div className="max-w-sm mt-3">
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            className="block px-2.5 py-2 w-full text-smalltext text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer"
                            placeholder=" "
                            onChange={(e) => searchHandlerYear(e.target.value)}
                        />
                        <label
                            htmlFor="search"
                            className="absolute text-smalltext text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                        >
                            Input year
                        </label>
                    </div>
                </div>
            </div>
            {/* PageTitle End */}
            <div className='w-full flex flex-col'>
                <div className={`flex w-full flex-col md:flex-row`}>
                    <div className='md:w-3/4'>
                        <BarChart chartData={averageRating} />
                    </div>
                    <div className='flex flex-col border border-gray-300 rounded-lg px-3.5 py-3 bg-white shadow-xm md:w-1/4 md:ml-6'>
                        <div className='font-bold text-normaltitle mb-3'>
                            Report Chat
                        </div>
                        <div className='w-full h-[2px] bg-black mb-6' />
                        <div className='flex flex-col justify-around'>
                            <div className='flex flex-col rounded-lg mb-6 px-3.5 py-3 bg-[#83d475] text-white'>
                                <div className='text-normaltitle font-bold mb-3'>
                                    Done
                                </div>
                                <div className='font-bold text-normaltitle'>
                                    {countStatus?.done}
                                </div>
                            </div>
                            <div className='flex flex-col rounded-lg mb-6 px-3.5 py-3 bg-red text-white'>
                                <div className='text-normaltitle font-bold mb-3'>
                                    Closed
                                </div>
                                <div className='font-bold text-normaltitle'>
                                    {countStatus?.closed}
                                </div>
                            </div>
                            <div className='flex flex-col rounded-lg px-3.5 py-3 bg-yellow text-white'>
                                <div className='text-normaltitle font-bold mb-3'>
                                    Pending
                                </div>
                                <div className='font-bold text-normaltitle'>
                                    {countStatus?.pending}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap w-full justify-between items-center mt-6'>
                    <div className='flex flex-col'>
                        <div className='text-normaltitle font-bold'>
                            Detail rating per month
                        </div>
                        <div className='h-0.5 bg-secblack my-2'></div>
                    </div>
                </div>
                <div className="max-w-sm mt-3 mb-6">
                    <div className='flex flex-col'>
                        <div id='category' className='relative text-smalltext'>
                            <div className={`flex items-center justify-between border border-gray-300 rounded-md px-1.5 py-2 outline-0 shadow-sm ${showDP ? 'ring-1 border-blue' : ''} hover:cursor-pointer`} onClick={() => setShowDP(!showDP)}>
                                <div className='px-1.5'>
                                    {
                                        month == null || month == undefined ? 'Choose month' 
                                        : month == 1 ? 'January'
                                        : month == 2 ? 'February'
                                        : month == 3 ? 'March'
                                        : month == 4 ? 'April'
                                        : month == 5 ? 'May'
                                        : month == 6 ? 'June'
                                        : month == 7 ? 'July'
                                        : month == 8 ? 'August'
                                        : month == 9 ? 'September'
                                        : month == 10 ? 'October'
                                        : month == 11 ? 'November'
                                        : month == 12 ? 'December'
                                        : '' 
                                    }
                                </div>
                                <BiChevronDown size={23} />
                            </div>
                            <div className={`${showDP ? 'absolute' : 'hidden'} w-full mt-2 border border-gray-300 shadow-sm rounded-md hover:cursor-pointer z-2 bg-white`}>
                                {
                                    labels.map((month:any) => (
                                        <div className='hover:bg-gray-300 px-3 py-2' onClick={() => searchHandlerMonth(month)} >
                                            {month}
                                        </div>  
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-full justify-center items-center'>
                    {
                        detailRating ?
                        detailRating.length != 0 ?
                            detailRating.map((detail:any) => (
                                <DetailRatingList detail={detail} />
                            ))
                            :
                            <AlertNoData title='Detail rating' />
                        :
                        <AlertLoading title='Detail rating' />
                    }
                </div>
            </div>
        </div>
    )
}

export default rating