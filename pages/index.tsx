import React, { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import {useIsAuthenticated} from "@azure/msal-react";
import { useRouter } from "next/router";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import { callMsGraph } from "../config/graph";

function LoginPage() {
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
		
			<div className="w-screen h-screen flex justify-center items-center move-bg">
				<div className="flex items-center z-10">
					<div className="sm:hidden lg:flex flex-col justify-center items-end w-550 text-end mr-16">
						<div className="text-white font-mont text-normal">
							Nice to see you again
						</div>
						<div className="text-white font-mont text-bigtitle font-bold pb-2 border-white border-b-4 mb-5">
							CONSULTATION APP
						</div>
						<div className="text-white font-mont text-normal">
							This application is made to help enrichment actors (students and
							supervisors). With this application, enrichment actors can directly
							chat with the enrichment admin to explain the problem about their
							enrichment program, then the enrichment admin will provide a
							solution to the problem.
						</div>
					</div>
					<LoginForm />
				</div>
			</div> 
		</>
	);
}

export default LoginPage;
