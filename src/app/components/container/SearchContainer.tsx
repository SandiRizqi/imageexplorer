import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';


export default function SearchContainer() {
    return (
        <div>
            {/* Content */}
            <div className="mt-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-700 bg-gray-800">
                            <tr className='text-xs'>
                                <th className="p-2"><input type="checkbox" /></th>
                                <th className="p-2">Sat</th>
                                <th className="p-2">Date ↓</th>
                                <th className="p-2">Res</th>
                                <th className="p-2">Cloud</th>
                                <th className="p-2">Off-Nadir</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody className='bg-white text-gray-800'>
                            {[
                                { sat: 'J14', date: '11-21-2024', res: '50 cm', cloud: '0.0%', offNadir: '2.9' },
                                { sat: 'BJ3A', date: '11-20-2024', res: '50 cm', cloud: '0.0%', offNadir: '10.4' },
                                { sat: 'P1', date: '09-18-2024', res: '50 cm', cloud: '0.0%', offNadir: '25.1', color: 'text-orange-400' },
                            ].map((row, index) => (
                                <tr key={index} className="border-b border-gray-700 text-xs">
                                    <td className="p-2"><input type="checkbox" /></td>
                                    <td className="p-2">{row.sat}</td>
                                    <td className="p-2">{row.date}</td>
                                    <td className="p-2">{row.res}</td>
                                    <td className="p-2">{row.cloud}</td>
                                    <td className={`p-2 font-semibold ${row.color || ''}`}>{row.offNadir}</td>
                                    <td className="p-2"><FaInfoCircle className="text-gray-400 hover:text-gray-200 cursor-pointer" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
