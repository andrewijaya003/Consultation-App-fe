import { NextRequest, NextResponse } from "next/server";
import { RESERVED_EVENTS } from "socket.io/dist/socket";

export default async function handleRefreshToken(req:NextRequest, res) {
    let token = req.cookies.ACCESS_TOKEN
    let refreshToken = req.cookies.REFRESH_TOKEN

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
        token = data.access_token
        res.status(200).json({
            access_token: data.access_token
        })
    } else {
        token = undefined
        res.cookies.ACCESS_TOKEN = ''
        res.cookies.REFRESH_TOKEN = ''    
        res.cookies.ROLE = ''
        req.nextUrl.pathname = '/'
        res.status(401).json({
            access_token: null
        })
    }

    
}