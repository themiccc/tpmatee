import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

interface Creator {
  id: number
  user_id: number
  bio: string
  title: string
  hourly_rate: number
  skills: string[]
  experience_years: number
}

export default function Discover() {
  const { user, isLoaded } = useUser()
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCreators()
  }, [])

  const fetchCreators = async () => {
    try {
      const response = await fetch('/api/v1/creators')
      const data = await response.json()
      setCreators(data.creators || [])
    } catch (error) {
      console.error('Failed to fetch creators:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Discover Mentors</h1>
          <Link href="/dashboard">
            <button className="text-gray-700 hover:text-purple-600">Dashboard</button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center text-gray-500">Loading mentors...</div>
        ) : creators.length === 0 ? (
          <div className="text-center text-gray-500">No mentors available yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <div key={creator.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{creator.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{creator.bio}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Experience</span>
                      <span className="text-sm font-medium text-gray-900">{creator.experience_years} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Rate</span>
                      <span className="text-lg font-bold text-purple-600">₹{creator.hourly_rate}/hr</span>
                    </div>
                  </div>
                  
                  {creator.skills && creator.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {creator.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Link href={`/book/${creator.user_id}`}>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                      Book Session
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
