// IMPORTS
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// CREATE FUNCTION
export default function Mycookbook() {
    // STATE VAIRABLES
    const [state, setState] = useState(0)


    // JAVASCRIPT LOGIC

    // HTML
    return (
        <>
            <head></head>
            <body>
                <div className='mt-20'>
                    This page will be the recipes I have saved and organised so that I have a cookbook collection
                    <div className='flex flex-col items-center w-full gap-2 mt-4 text-2xl font-semibold'>
                    <hr className='w-full'></hr>
                        <div><Link to='/recipe'>Starters</Link></div>
                        <hr className='w-full'></hr>
                        <div>Chicken Meals</div>
                        <hr className='w-full'></hr>
                        <div>Pasta Meals</div>
                        <hr className='w-full'></hr>
                        <div>Deserts</div>
                        <hr className='w-full'></hr>
                    </div>
                </div>
            </body>
        </>
    )
}
