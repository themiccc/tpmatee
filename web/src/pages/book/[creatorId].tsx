import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface Slot {
  id: number
  start_time: string
  end_time: string
  is_available: boolean
}

export default function BookSession() {
  const router = useRouter()
  const { creatorId } = router.query
  const { user } = useUser()
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingInProgress, setBookingInProgress] = useState(false)

  useEffect(() => {
    if (creatorId) {
      fetchSlots()
    }
  }, [creatorId])

  const fetchSlots = async () => {
    try {
      const response = await fetch(
        `/api/v1/bookings/slots/available/${creatorId}?slot_date=${new Date().toISOString().split('T')[0]}`
      )
      const data = await response.json()
      setSlots(data.slots || [])
    } catch (error) {
      console.error('Failed to fetch slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedSlot || !user) return

    setBookingInProgress(true)
    try {
      const token = await user.getToken()
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          creator_id: parseInt(creatorId as string),
          slot_id: selectedSlot,
          service_id: 1, // TODO: get from params
        }),
      })

      const data = await response.json()
      if (response.ok) {
        // Redirect to payment
        router.push(`/payment/${data.booking_id}`)
      }
    } catch (error) {
      console.error('Failed to create booking:', error)
    } finally {
      setBookingInProgress(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Select a Time Slot</h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading available slots...</div>
        ) : slots.length === 0 ? (
          <div className="text-center text-gray-500">No available slots</div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-4 border-2 rounded-lg transition ${
                    selectedSlot === slot.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-400'
                  } ${!slot.is_available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!slot.is_available}
                >
                  <div className="text-left">
                    <div className="font-medium">
                      {new Date(slot.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(slot.start_time).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedSlot || bookingInProgress}
              className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
            >
              {bookingInProgress ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
