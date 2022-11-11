import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'

function LoginForm() {
    const [actor, setActor] = useState('Student')
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function actorHandler(value:any) {
        setActor(value)
    }

    async function loginHandler(){
        console.log(process.env.BASE_URL+'/auth/login')
        console.log(email+' '+password)
        const response:Response = await fetch(process.env.BASE_URL+'/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "appliacation/json" 
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
                "role": actor
            })
        })

        // const json = await response.json()
        // console.log(json)
        // return json
        // router.push('/home')
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
				<div onClick={() => actorHandler('Student')} className="w-max h-max text-center text-smalltext text-gray-400 font-bold duration-200 hover:text-blue hover:cursor-pointer">
					Student
				</div>
				<div onClick={() => actorHandler('Admin')} className="w-max h-max text-center text-smalltext text-gray-400 font-bold duration-200 hover:text-blue hover:cursor-pointer">
					Admin
				</div>
				<div onClick={() => actorHandler('Faaculty Supervisor')} className="w-max h-max text-center text-smalltext text-gray-400 font-bold duration-200 hover:text-blue hover:cursor-pointer">
					Faculty Supervisor
				</div>
				<div onClick={() => actorHandler('Site Supervisor')} className="w-max h-max text-center text-smalltext text-gray-400 font-bold duration-200 hover:text-blue hover:cursor-pointer">
					Site Supervisor
				</div>
			</div>
			<div className="text-smalltitle text-blue font-bold mb-7">
				Login {actor} Enrichment
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
			<div className="w-345 pb-5">
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
			<input type='button' value='Log In' className="w-345 mb-10 py-3 rounded-md bg-blue text-center text-white font-bold hover:cursor-pointer hover:bg-hoverblue duration-200" onClick={loginHandler} />
		</form>
    )
}

export default LoginForm