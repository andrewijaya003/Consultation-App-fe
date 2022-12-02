import React, { useEffect, useState } from 'react'
import BarChart from '../components/Chart/BarChart'

const DUMMY_ROOMCHATS = [
    {
        id: '1',
        startDate: '2017-11-01',
        startTime: '11:22',
        endDate: '2022-11-02',
        endTime: '15:07',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
    {
        id: '2',
        startDate: '2017-11-03',
        startTime: '07:11',
        endDate: '2022-11-03',
        endTime: '10:00',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
    {
        id: '3',
        startDate: '2018-11-01',
        startTime: '11:22',
        endDate: '2022-11-02',
        endTime: '15:07',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
    {
        id: '4',
        startDate: '2018-11-03',
        startTime: '07:11',
        endDate: '2022-11-03',
        endTime: '10:00',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
    {
        id: '5',
        startDate: '2019-11-01',
        startTime: '11:22',
        endDate: '2022-11-02',
        endTime: '15:07',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
    {
        id: '6',
        startDate: '2019-11-03',
        startTime: '07:11',
        endDate: '2022-11-03',
        endTime: '10:00',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
    {
        id: '7',
        startDate: '2020-11-01',
        startTime: '11:22',
        endDate: '2022-11-02',
        endTime: '15:07',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
    {
        id: '8',
        startDate: '2020-11-03',
        startTime: '07:11',
        endDate: '2022-11-03',
        endTime: '10:00',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
    {
        id: '9',
        startDate: '2021-11-01',
        startTime: '11:22',
        endDate: '2022-11-02',
        endTime: '15:07',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
    {
        id: '10',
        startDate: '2021-11-03',
        startTime: '07:11',
        endDate: '2022-11-03',
        endTime: '10:00',
        solution: 'Menghubungi pihak Intership untuk mengganti Site Supervisor',
    },
]

const DUMMY_RATINGS = [
    {
        id: '1',
        roomId: '1',
        ratingNumber: '4',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    },
    {
        id: '2',
        roomId: '2',
        ratingNumber: '5',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    },
    {
        id: '3',
        roomId: '3',
        ratingNumber: '3',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    },
    {
        id: '4',
        roomId: '4',
        ratingNumber: '5',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    },
    {
        id: '5',
        roomId: '5',
        ratingNumber: '1',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    },
    {
        id: '6',
        roomId: '6',
        ratingNumber: '4',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    },
    {
        id: '7',
        roomId: '7',
        ratingNumber: '2',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    },
    {
        id: '8',
        roomId: '8',
        ratingNumber: '4',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    },
    {
        id: '9',
        roomId: '9',
        ratingNumber: '5',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    },
    {
        id: '10',
        roomId: '10',
        ratingNumber: '5',
        ratingDescription: 'Bagus dan fast respon',
        advice: 'Lebih ditingkat kan skill komunikasinya'
    }
]

function rating() {
    const [add, setAdd] = useState(false)
    const [search, setSearch] = useState(new Date().getFullYear().toString())
    const [range, setRange] = useState<number[]>()
    const [ratings, setRatings] = useState({
        labels: range,
        datasets: [{
            label: 'Average Rating',
            data: [20, 25, 45, 50, 55, 60, 10, 12, 11, 15]
        }]
    })
    
    function addHandler(){
        setAdd(true)
    }

    function searchHandler(value:string){
        setSearch(value)
    }

    useEffect(() => {
        let years = []
        let year = parseInt(search)

        for(let i = year; i > year-10; i--) {
            years.unshift(i)
        }

        setRange(years)
    }, [search])

    useEffect(() => {
        setRatings({
            labels: range,
            datasets: [{
                label: 'Average Rating',
                data: [20, 25, 45, 50, 55, 40, 10, 12, 11, 15],
                backgroundColor: ['#00a9e2'],
                borderColor: 'black',
                borderWidht: 1
            }]
        })
    }, [range])
    
    
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
                    <div className='flex justify-end' onClick={addHandler}>
                        <input type="submit" value='Add New Rating' className='bg-blue text-white text-normal font-semibold rounded px-4 py-1.5 hover:cursor-pointer' />
                    </div>
                </div>
                <div className="w-96 mt-3">
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            className="block px-2.5 py-2 w-full text-smalltext text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer"
                            placeholder=" "
                            onChange={(e) => searchHandler(e.target.value)}
                        />
                        <label
                            htmlFor="search"
                            className="absolute text-smalltext text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                        >
                            Search rating by year
                        </label>
                    </div>
                </div>
            </div>
            {/* PageTitle End */}
            <div>
                <BarChart chartData={ratings} />
            </div>
        </div>
    )
}

export default rating