import { useRouter } from 'next/router'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

export default function Payment() {
  const router = useRouter()
  const { bookingId } = router.query
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [gateway, setGateway] = useState<'razorpay' | 'stripe'>('razorpay')

  const handlePayment = async () => {
    setLoading(true)
    try {
      const token = await user?.getToken()
      const response = await fetch('/api/v1/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: parseInt(bookingId as string),
          gateway,
        }),
      })

      const data = await response.json()

      if (gateway === 'razorpay') {
        // Load Razorpay
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          const options = {
            key: data.key_id,
            amount: data.amount,
            currency: data.currency,
            order_id: data.order_id,
            handler: async (response: any) => {
              // Verify payment on backend
              await fetch('/api/v1/payments/razorpay/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  booking_id: parseInt(bookingId as string),
                }),
              })
              router.push('/dashboard')
            },
          }
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        }
        document.body.appendChild(script)
      }
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Booking ID</p>
          <p className="text-lg font-medium">{bookingId}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Payment Gateway</label>
          <select
            value={gateway}
            onChange={(e) => setGateway(e.target.value as 'razorpay' | 'stripe')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="razorpay">Razorpay (India)</option>
            <option value="stripe">Stripe (Global)</option>
          </select>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Processing...' : `Pay with ${gateway === 'razorpay' ? 'Razorpay' : 'Stripe'}`}
        </button>
      </div>
    </div>
  )
}
