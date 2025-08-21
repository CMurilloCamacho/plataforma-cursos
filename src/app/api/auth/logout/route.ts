import { NextResponse } from "next/server";


export const POST = ()=>{
    const response = NextResponse.json({message: 'Sesion cerrada con éxito'})
    response.cookies.set({
        name: 'token',
        value: '',
        path: '/',
        expires: new Date(0),
        httpOnly: true,
        // secure: true
        sameSite: 'strict'
    })
    return response

}