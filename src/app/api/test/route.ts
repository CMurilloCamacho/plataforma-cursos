import { NextRequest, NextResponse } from "next/server"

export const GET = (req: NextRequest)=> {
// const propiedades = Object.keys(req)
const proto = Object.getPrototypeOf(req)
const protoPropiedades = Object.getOwnPropertyNames(proto)
// console.log('prop', propiedades)
console.log('proto', proto)
console.log('protoProps', protoPropiedades)

return NextResponse.json({
    // propiedades,
    proto,
    protoPropiedades
})
}