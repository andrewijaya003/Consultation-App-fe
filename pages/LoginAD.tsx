import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { loginRequest } from '../config/authConfig';
import { callMsGraph } from '../config/graph';
import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import ReactLoading from 'react-loading';

function loginAD() {
    const microsoftIsAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();
    const role = getCookie('ROLE')
    const [graphData, setGraphData] = useState();
    const router = useRouter()
    const [errorMsg, setErrorMsg] = useState('please wait')
	const [isDone, setIsDone] = useState(false)
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
    }, []);

    
    useEffect(() => {
        if(microsoftIsAuthenticated == true){
			instance
			.acquireTokenSilent({
				...loginRequest,
				account: accounts[0],
			})
			.then((response) => {
				callMsGraph(response.accessToken).then((response) => {
					setGraphData(response)
					fetch(process.env.BASE_URL+'/auth/login', {
						headers : { 
							"Content-Type" : "application/json" 
						},
						method: 'POST',
						body: JSON.stringify({
							email: accounts[0].username,
							role: window.localStorage.getItem('ROLE') == undefined ? 'STUDENT' : window.localStorage.getItem('ROLE')
						})
					}).then(
						res => res.json()
					).then(async (data) => {
						// console.log('ini data ')
						// console.log(data)
						if(data.statusCode > 300) {
							setErrorMsg('check your role')
						} else {
							setCookie('REFRESH_TOKEN', data.refresh_token, {maxAge: 86400*7})
							setCookie('ACCESS_TOKEN', data.access_token, {maxAge: 7200})
							setCookie('ROLE', window.localStorage.getItem('ROLE') == undefined ? 'STUDENT' : window.localStorage.getItem('ROLE'), {maxAge: 86400*7})
							setIsDone(true)
						}
					}).catch(() => {
						setErrorMsg('credential')
					})
				});
			}).catch((err) => console.log(err))
        }
    }, [microsoftIsAuthenticated]);

	useEffect(() => {
		if(isDone) {
			setIsDone(false)
			router.push("/home")
		}
	}, [isDone])
    
    return (
        <>
            <Particles
				id="tsparticles"
				init={particlesInit}
				loaded={particlesLoaded}
				options={{
					"fpsLimit": 90,
					"interactivity": {
					"events": {
						"onClick": {
						"enable": false,
						"mode": "push"
						},
						"onHover": {
						"enable": true,
						"mode": "grab"
						},
						"resize": true
					},
					"modes": {
						"bubble": {
						"distance": 400,
						"duration": 2,
						"opacity": 0.8,
						"size": 40
						},
						"repulse": {
						"distance": 200,
						"duration": 0.4
						},
						"grab": {
							"distance": 200
						}
					}
					},
					"particles": {
					"color": {
						"value": "#ffffff"
					},
					"links": {
						"color": "#ffffff",
						"distance": 150,
						"enable": true,
						"opacity": 1,
						"width": 2
					},
					"collisions": {
						"enable": true
					},
					"move": {
						"direction": "none",
						"enable": true,
						"outMode": "bounce",
						"random": false,
						"speed": 1,
						"straight": false
					},
					"number": {
						"density": {
						"enable": true,
						"area": 300
						},
						"value": 18
					},
					"opacity": {
						"value": 0.5
					},
					"shape": {
						"type": "circle"
					},
					"size": {
						"random": false,
						"value": 3.5
					}
					},
					"detectRetina": true
				}}
			/>

            <div className="w-screen h-screen flex flex-col justify-center items-center move-bg">
                <div className={`text-center text-white font-bold border-white ${errorMsg == 'please wait' ? '' : 'border-b-4' }`}>
                    {
                        errorMsg == 'please wait' ?
                        <p className='flex text-bigtitle flex-col justify-center items-center'>
                            PLEASE WAIT
							<ReactLoading type={'bars'} color={'#ffffff'} width={100} height={0} />
                        </p>
                        :
                        <p className='text-bigtitle'>
                            YOU SEEM TO BE LOST!
                        </p>
                    }
                </div>
                {
                    errorMsg == 'please wait' ?
                    <></>
                    :
                    <div className='text-white font-mont text-center text-normal mt-5'>
                        <p>
                            You have an error when you try to login please {errorMsg}.
                        </p>
                        <p>
                            If you have any bug or issue please contact enrichment staff.
                        </p>
                    </div>
                }
			</div> 
        </>
    )
}

export default loginAD