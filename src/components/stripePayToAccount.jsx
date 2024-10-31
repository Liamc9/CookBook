// IMPORTS
import { useState, useEffect } from 'react'
import StripePaymentDisplay from './stripePaymentDisplay'
// CREATE FUNCTION
export default function StripePayToAccount() {
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
            <StripePaymentDisplay
  useCustomer={true}
  customerEmail="liam12crowley@gmail.com"
  attachPaymentMethod={true}
  currency="eur" // Specify the currency here
  destinationAccount="acct_1PP14o4CfuQN95oo" // Specify the Stripe Connect account ID if blank the payment just goes to me
/>
            </body>
        </>
    )
}