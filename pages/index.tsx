import React from "react";
import LoginForm from "../components/LoginForm";
// bg-gradient-to-r from-blue to-cyan-300
function LoginPage() {
	return (
		<div className="w-screen h-screen flex justify-center items-center move-bg">
			<div className="flex items-center ">
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
	);
}

export default LoginPage;
