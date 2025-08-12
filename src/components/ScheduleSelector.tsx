'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Papa from 'papaparse'
import { loadSchedulesFromCsv } from '@/lib/schedule-loader'
import { Schedule } from '@/lib/types'

interface CsvScheduleRow {
  num_players: number
  num_rounds: number
  round_index: number
  pairs: string
}

export function ScheduleSelector() {
  const [numCourts, setNumCourts] = useState<number>(2)
  const [numPlayers, setNumPlayers] = useState<number>(8)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load schedules from CSV file based on selected courts
  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true)
      setError(null)
      setSelectedSchedule(null)
      try {
        const filePath = `/schedules/schedules_${numCourts}_courts_rounds.csv`
        const res = await fetch(filePath)
        if (!res.ok) throw new Error(`Failed to load ${filePath}`)
        const text = await res.text()
        const result = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true })
        const rows = (result.data as any[]).map((r) => ({
          num_players: Number(r.num_players),
          num_rounds: Number(r.num_rounds),
          round_index: Number(r.round_index),
          pairs: String(r.pairs),
        })) as CsvScheduleRow[]
        const schedules = loadSchedulesFromCsv(rows)
        // Stamp the correct number of courts (derived from filename/selection)
        const withCourts = schedules.map((s) => ({ ...s, numCourts }))
        setAllSchedules(withCourts)
      } catch (e: any) {
        setError(e.message || 'Failed to load schedules')
        setAllSchedules([])
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [numCourts])

  // Filter schedules by selected criteria
  const availableSchedules = allSchedules.filter(
    (schedule) => schedule.numCourts === numCourts && schedule.numPlayers === numPlayers
  )

  const handleStartSession = () => {
    if (selectedSchedule) {
      console.log('Starting session with schedule:', selectedSchedule)
      // TODO: Navigate to session page
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Session Configuration</CardTitle>
          <CardDescription>Choose the number of courts and players for your session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="players">Number of Players</Label>
              <Input
                id="players"
                type="number"
                min="4"
                max="16"
                value={numPlayers}
                onChange={(e) => setNumPlayers(parseInt(e.target.value) || 4)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courts">Number of Courts</Label>
              <Input
                id="courts"
                type="number"
                min="1"
                max="4"
                value={numCourts}
                onChange={(e) => setNumCourts(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Available Schedules</CardTitle>
          <CardDescription>
            Select a precomputed schedule for {numCourts} court{numCourts > 1 ? 's' : ''} and {numPlayers} players
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-muted-foreground">Loading schedules…</div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : availableSchedules.length > 0 ? (
            <div className="grid gap-3">
              {availableSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSchedule?.id === schedule.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedSchedule(schedule)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{schedule.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {schedule.numRounds} rounds • {schedule.numPlayers} players
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-muted-foreground">
                        {schedule.numCourts} court{schedule.numCourts > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No schedules available for {numCourts} court{numCourts > 1 ? 's' : ''} and {numPlayers} players
              </p>
              <p className="text-sm">Try adjusting the number of courts or players</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Start Session Button */}
      {selectedSchedule && (
        <div className="text-center">
          <Button size="lg" onClick={handleStartSession} className="px-8">
            Start Session with {selectedSchedule.name}
          </Button>
        </div>
      )}
    </div>
  )
}
