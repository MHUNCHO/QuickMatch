'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SessionManager, TournamentSession } from '@/lib/session-manager'

export default function SessionsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Record<string, TournamentSession>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const allSessions = SessionManager.getAllSessions()
    setSessions(allSessions)
    setLoading(false)
  }, [])

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this tournament session?')) {
      SessionManager.deleteSession(sessionId)
      const updatedSessions = SessionManager.getAllSessions()
      setSessions(updatedSessions)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading sessions...</p>
        </div>
      </div>
    )
  }

  const sessionList = Object.values(sessions).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <div className="min-h-screen bg-slate-50 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tournament Sessions</h1>
              <p className="text-slate-600 mt-2">Manage your created tournament schedules</p>
            </div>
            <Button onClick={() => router.push('/tournament')}>
              Create New Tournament
            </Button>
          </div>
        </div>

        {sessionList.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-slate-500 mb-6">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tournaments created yet</h3>
              <p className="text-slate-600 mb-6">Create your first tournament schedule to get started</p>
              <Button onClick={() => router.push('/tournament')}>
                Create Tournament
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessionList.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="truncate">{session.configuration.gameMode} Tournament</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full capitalize">
                      {session.configuration.matchType}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Players:</span>
                      <span className="font-medium">{session.players.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Courts:</span>
                      <span className="font-medium">{session.configuration.numCourts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Rounds:</span>
                      <span className="font-medium">{session.selectedSchedule.numRounds}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Date:</span>
                      <span className="font-medium">{session.configuration.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Created:</span>
                      <span className="font-medium">{formatDate(session.createdAt)}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => router.push(`/session/${session.id}`)}
                        >
                          View Schedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
