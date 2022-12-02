import axios, { AxiosResponse } from 'axios'
import { setCookie, getCookie } from 'cookies-next'
import { Cookies } from 'next/dist/server/web/spec-extension/cookies'
import { useRouter } from 'next/router'
import { NextResponse } from 'next/server'
import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import ReactLoading from 'react-loading';
import AlertError from './AlertError'
import { MdCancel } from '@react-icons/all-files/md/MdCancel'

function LoginForm() {
    const router = useRouter()
    const [actor, setActor] = useState('STUDENT')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    function actorHandler(value:any) {
        setActor(value)
    }

    async function loginHandler() {
        if(email === '') {
            setErrorMsg('Email must be filled')
        } else if(password === '') {
            setErrorMsg('Password must be filled')
        } else {
            setLoading(true)
            const user = {
                "email": email,
                "password": password,
                "role": actor
            }
    
            const response:any = await fetch(process.env.BASE_URL+'/auth/login', {
                headers : { 
                    "Content-Type" : "application/json"
                },
                method: 'POST',
                body: JSON.stringify(user)
            }).then(
                res => res.json()
            ).then((data) => {
                setLoading(false)
                return data
            }).catch(err => {
                console.log(err)
            })
            
            setLoading(false)
            console.log(response)
    
            if(response != undefined) {
                const data:any = await response
        
                setCookie('ACCESS_TOKEN', data.access_token, {maxAge: 7200})
                setCookie('REFRESH_TOKEN', data.refresh_token, {maxAge: 7200})
                
                
                await router.push('/home')
            } else {
                setErrorMsg('Wrong credential')
            }
        }

    }

    return (
        <form
			action=""
			className="bg-white flex flex-col items-center rounded-md drop-shadow-md"
        >
			<div className="flex items-center pb-5 px-5 w-385 border-b border-gray-300">
				<img
                    src="https://enrichment.apps.binus.ac.id/lib/css/themes/university/images/login/ribbon.png"
                    alt=""
				/>
				<img
				className="ml-5"
                    src="https://enrichment.apps.binus.ac.id/images/logo.png?v=l1ZdBpJPPzprQVWBvPBwaSmiI7wYiBCjgdBuHozyxuI"
                    alt=""
				/>
			</div>
			<div className="flex w-full justify-evenly items-center h-12 border-b border-gray-300 mb-7">
				<div onClick={() => actorHandler('STUDENT')} className="w-max h-max text-center text-smalltext text-gray-400 font-bold duration-200 hover:text-blue hover:cursor-pointer">
					Student
				</div>
				<div onClick={() => actorHandler('STAFF')} className="w-max h-max text-center text-smalltext text-gray-400 font-bold duration-200 hover:text-blue hover:cursor-pointer">
					Staff
				</div>
				<div onClick={() => actorHandler('FACULTY SUPERVISOR')} className="w-max h-max text-center text-smalltext text-gray-400 font-bold duration-200 hover:text-blue hover:cursor-pointer">
					Faculty Supervisor
				</div>
				<div onClick={() => actorHandler('SITE SUPERVISOR')} className="w-max h-max text-center text-smalltext text-gray-400 font-bold duration-200 hover:text-blue hover:cursor-pointer">
					Site Supervisor
				</div>
			</div>
			<div className="text-normal text-blue font-bold mb-7">
				LOGIN {actor} ENRICHMENT
			</div>
			<div className="w-345 pb-3.5">
				<div className="relative">
                    <input
                        type="email"
                        id="binusian_email"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-normal text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer"
                        placeholder=" "
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label
                        htmlFor="binusian_email"
                        className="absolute text-normal text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                    >
                        Binusian email
                    </label>
				</div>
			</div>
			<div className="w-345 pb-3.5">
				<div className="relative">
                    <input
                        type="password"
                        id="password"
                        className="block px-2.5 pb-2.5 pt-4 w-full text-normal text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue focus:outline-none focus:ring-0 focus:border-blue peer"
                        placeholder=" "
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label
                        htmlFor="password"
                        className="absolute text-normal text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-px z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue peer-focus:dark:text-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-px peer-focus:scale-90 peer-focus:-translate-y-4 left-1"
                    >
                        Password
                    </label>
				</div>
			</div>
            {
                errorMsg !== '' ? 
                <div className='flex w-345 rounded-lg px-2 py-2 mb-3.5 bg-white shadow-xm bg-pink'>
                    <div className='text-red mr-3 text-normaltitle hover:cursor-pointer' onClick={() => setErrorMsg('')}>
                        <MdCancel />
                    </div>
                    <div className='flex flex-col w-full'>
                        <div className='text-redblack text-smalltext font-bold'>
                            Alert
                        </div>
                        <div className='text-tinytext text-red'>
                            {errorMsg}.
                        </div>
                    </div>
                </div> : <></>
            }
            <div className='flex justify-center w-345 mb-10 py-3 rounded-md bg-blue text-center text-white font-bold hover:cursor-pointer hover:bg-hoverblue duration-200' onClick={loginHandler}>
                {
                    loading ? <ReactLoading type={'spin'} color={'#ffffff'} width={20} height={0} /> : <></>
                }
			    <input className='ml-2' type='button' value='Log In' />
            </div>
		</form>
    )
}

export default LoginForm