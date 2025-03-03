import React from 'react'

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white mt-4 text-sm">Loading, please wait...</p>
            </div>
        </div>
    )
}
