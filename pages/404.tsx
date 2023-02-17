import React from 'react'
import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function NotFound() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
    }, []);

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
                <div className=' text-center text-white font-bold border-white border-b-4'>
                    <p className='text-[100px]'>
                        404
                    </p>
                    <p className='text-[30px]'>
                        YOU SEEM TO BE LOST!
                    </p>
                </div>
                <div className='text-white font-mont text-center text-normal mt-5 whitespace-pre-wrap break-word'>
                    The page you&apos;re looking for isn&apos;t available.
                    <br/>
                    Try searching again or back to previous page.
                </div>
			</div> 
        </>
    )
}

export default NotFound