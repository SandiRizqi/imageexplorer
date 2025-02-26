import React from 'react'

export default function AccountContainer() {
    return (
        <div>

            <ul className="space-y-2">
                <li className="hover:bg-gray-700 p-2 rounded">Profile</li>
                <li className="hover:bg-gray-700 p-2 rounded">Settings</li>
                <li className="hover:bg-gray-700 p-2 rounded">Logout</li>
            </ul>
        </div>
    )
}
