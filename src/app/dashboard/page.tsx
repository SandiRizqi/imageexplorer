"use client"
import React from 'react';
import { useAuth } from '../components/context/AuthProrider';


export default function Dashboard() {
    const { status, signIn, signOut } = useAuth();
    return (
        <>
            <div>Dashboard : {status}</div>
            <button
                onClick={() => signIn()}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Sign In with Google
            </button>

            <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
                Sign Out
            </button>
        </>
    )
}
