// IMPORTS
import { useState, useEffect } from 'react'

// CREATE FUNCTION
export default function Addrecipe() {
    // STATE VARIABLES
    const [state, setState] = useState(0)

    // JAVASCRIPT LOGIC
    useEffect(() => {
        setState(state + 1)
    }, [])

    // HTML
    return (
        <>
            <head></head>
            <body>
                <div className='mt-20'>
                    This is where you post a recipe
                    For the steps do them as videos that are max 10-20 seconds long
                    For the writing on the steps maybe there's like a popout button that slides the wording out from the side of each video 
                    ingredients have nice icons beside them
                    Have the recipe home page containing the overview video and the ingredients
                </div>
            </body>
        </>
    )
}
