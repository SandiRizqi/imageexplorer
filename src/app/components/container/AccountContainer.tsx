import React from 'react'

export default function AccountContainer() {
    return (
        <div className='flex flex-col h-full'>
            <ul className="space-y-2 bg-gray-800 text-sm">
                <li className="hover:bg-gray-700 p-2">Profile</li>
                <li className="hover:bg-gray-700 p-2">Settings</li>
                <li className="hover:bg-gray-700 p-2">Logout</li>
            </ul>
        </div>
    )
}
