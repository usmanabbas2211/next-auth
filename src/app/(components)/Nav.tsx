import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/options'

const Nav = async () => {
    const session = await getServerSession(authOptions)
    return (
        <header className='bg-gray-600 text-gray-100'>
            <nav className='flex justify-between items-center w-full px-10 py-4'>
                <div>Next Auth</div>
                <div className='flex gap-10'>
                    <Link href='/'>Home</Link>
                    <Link href='/create-user'>Create User</Link>
                    <Link href='/member'>Member</Link>
                    <Link href='/member-client'>Client Member</Link>
                    <Link href='/public'>Public</Link>
                    {session ? <Link href='/api/auth/signout?callbackUrl=/' >Logout</Link> : <Link href='/api/auth/signin' >Login</Link>}
                </div>
            </nav>
        </header>
    )
}

export default Nav