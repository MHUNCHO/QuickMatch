'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SessionPage() {
  const searchParams = useSearchParams()
  
  const sessionId = searchParams.get('sessionId')
  const courts = searchParams.get('courts')
  const rounds = searchParams.get('rounds')
  const date = searchParams.get('date')
  const mode = searchParams.get('mode')
  const type = searchParams.get('type')
  const level = searchParams.get('level')
  const players = searchParams.get('players')

  const playerList = players ? players.split(',').map(p => p.trim()) : []

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tournament Session</h1>
              <p className="text-slate-600 mt-2">Session ID: {sessionId}</p>
            </div>
            <Link href="/tournament">
              <Button variant="outline">Back to Generator</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle>Session Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Courts</label>
                  <p className="text-lg font-semibold text-slate-900">{courts}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Rounds</label>
                  <p className="text-lg font-semibold text-slate-900">{rounds}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Game Mode</label>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{mode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Match Type</label>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Date</label>
                  <p className="text-lg font-semibold text-slate-900">{date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Level</label>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{level}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Players */}
          <Card>
            <CardHeader>
              <CardTitle>Participants ({playerList.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {playerList.map((player, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-emerald-700">{index + 1}</span>
                    </div>
                    <span className="font-medium text-slate-900">{player}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Ready to Start?</h3>
              <p className="text-slate-600 mb-6">Your tournament is configured and ready to begin</p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Start Tournament
                </Button>
                <Button variant="outline" size="lg">
                  View Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
