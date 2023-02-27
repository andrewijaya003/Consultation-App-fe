import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { NextRequest, NextResponse } from "next/server";
import { useState } from "react";

export async function middleware(request:NextRequest) {
    let token = request.cookies.get('ACCESS_TOKEN')
    let refreshToken = request.cookies.get('REFRESH_TOKEN')
    let { pathname } = request.nextUrl
	// let response = NextResponse.next()

    const data = await fetch(process.env.BASE_URL + '/auth/refresh-token', {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            refresh_token: refreshToken
        })
    }).then(data => data.json())

    if(data.access_token != undefined){
		const response = NextResponse.next()
        response.cookies.set('ACCESS_TOKEN', data.access_token)
        token = data.access_token
		console.log('token ada')
		
		if((pathname == '/' || pathname =='/LoginAD') && token != undefined) {
			console.log('token ada 2')
			request.nextUrl.pathname = '/home'
		} else if(request.cookies.get('ROLE') !== 'STAFF' && (pathname == '/chat' || pathname == '/rating' || pathname == '/manage-category-faq' || pathname == '/manage-meeting')) {
			console.log('token ada 3')
			request.nextUrl.pathname = '/404'
		} else if(request.cookies.get('ROLE') == 'STAFF' && (pathname == '/contact' || pathname == '/meeting')) {
			console.log('token ada 4')
			request.nextUrl.pathname = '/404'
		} else {
			return NextResponse.next()
		}
    } else {
        token = undefined
		if(!(pathname == '/' || pathname == '/LoginAD')) {
			request.nextUrl.pathname = '/'
		}
    }
	
	if(token == undefined && (pathname == '/' || pathname == '/LoginAD')) {
		return NextResponse.next()
	}

	const response = NextResponse.redirect(request.nextUrl)

	return response
}

export const config = {
	matcher: [
		'/((?!api|_next/static|favicon.ico).*)',
	],
}