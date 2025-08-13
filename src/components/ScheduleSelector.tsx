'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Papa from 'papaparse'
import { loadSchedulesFromCsv } from '@/lib/schedule-loader'
import { Schedule } from '@/lib/types'
import { SessionManager } from '@/lib/session-manager'
import { formatTime } from '@/lib/utils'

interface CsvScheduleRow {
  num_players: number
  num_rounds: number
  round_index: number
  pairs: string
}

export function ScheduleSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [numCourts, setNumCourts] = useState<number>(2)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4'])
  const [gameMode, setGameMode] = useState<string>('melee')
  const [matchType, setMatchType] = useState<string>('doubles')
  const [date, setDate] = useState<string>('')
  const [competitionLevel, setCompetitionLevel] = useState<string>('unrated')

  // Calculate number of players from textarea lines (excluding empty lines)
  const numPlayers = playerNames.filter(name => name.trim() !== '').length

  // Initialize from URL parameters
  useEffect(() => {
    const courts = searchParams.get('courts')
    const mode = searchParams.get('mode')
    const type = searchParams.get('type')
    const sessionDate = searchParams.get('date')
    const level = searchParams.get('level')
    const players = searchParams.get('players')
    
    if (courts) setNumCourts(parseInt(courts) || 2)
    if (mode) setGameMode(mode)
    if (type) setMatchType(type)
    if (sessionDate) setDate(sessionDate)
    if (level) setCompetitionLevel(level)
    if (players) {
      const playerList = players.split(',').map(p => p.trim()).filter(p => p)
      if (playerList.length > 0) setPlayerNames(playerList)
    }
  }, [searchParams])

  // Load schedules from CSV file based on selected courts
  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true)
      setError(null)
      setSelectedSchedule(null)
      try {
        const filePath = `/schedules/schedules_${numCourts}_${numCourts === 1 ? 'court' : 'courts'}_rounds.csv`
        const res = await fetch(filePath)
        if (!res.ok) throw new Error(`Failed to load ${filePath}`)
        const text = await res.text()
        const result = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true })
        const rows = (result.data as Record<string, unknown>[]).map((r) => ({
          num_players: Number(r.num_players),
          num_rounds: Number(r.num_rounds),
          round_index: Number(r.round_index),
          pairs: String(r.pairs),
        })) as CsvScheduleRow[]
        const schedules = loadSchedulesFromCsv(rows, numCourts)
        setAllSchedules(schedules)
      } catch (e: unknown) {
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



  const handlePlayerNamesChange = (text: string) => {
    const names = text.split('\n')
    setPlayerNames(names)
  }

  const handleStartSession = () => {
    if (selectedSchedule) {
      // Create a new tournament session
      const session = SessionManager.createSession(
        {
          numCourts,
          gameMode,
          matchType,
          date: date || new Date().toISOString().split('T')[0],
          competitionLevel
        },
        playerNames.filter(name => name.trim() !== ''),
        selectedSchedule
      )
      
      // Navigate to the session page
      router.push(`/session/${session.id}`)
    }
  }

  return (
    <div className="space-y-6">
                    {/* Combined Configuration and Participants */}
       <Card>
         <CardContent className="p-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Left Section: Session Configuration */}
             <div className="space-y-4">
               <div>
                 <h3 className="text-lg font-semibold text-slate-900 mb-1">Session Configuration</h3>
                 <p className="text-sm text-slate-500">Configure your badminton session settings</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                 
                                   <div className="space-y-2">
                    <Label htmlFor="gameMode">Game Mode</Label>
                    <select
                      id="gameMode"
                      value={gameMode}
                      onChange={(e) => setGameMode(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="melee">Melee</option>
                      <option value="swiss">Swiss</option>
                      <option value="elimination">Elimination</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="matchType">Match Type</Label>
                    <select
                      id="matchType"
                      value={matchType}
                      onChange={(e) => setMatchType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="doubles">Doubles</option>
                      <option value="singles">Singles</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="competitionLevel">Competition Level</Label>
                    <select
                      id="competitionLevel"
                      value={competitionLevel}
                      onChange={(e) => setCompetitionLevel(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="rated">Rated</option>
                      <option value="unrated">Friendly</option>
                    </select>
                  </div>
               </div>
             </div>
             
             {/* Right Section: Participants */}
             <div className="space-y-4">
               <div>
                 <h3 className="text-lg font-semibold text-slate-900 mb-1">Participants ({numPlayers})</h3>
                 <p className="text-sm text-slate-500">One per line. Player order will be randomized for fair matchups.</p>
               </div>
               
               <Textarea
                 placeholder="Enter player names, one per line..."
                 value={playerNames.join('\n')}
                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePlayerNamesChange(e.target.value)}
                 className="min-h-[200px]"
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
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                               {availableSchedules.map((schedule) => (
                                   <div
                    key={schedule.id}
                    className={`bg-white border border-slate-200/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-1 ${
                      selectedSchedule?.id === schedule.id
                        ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 shadow-2xl ring-2 ring-emerald-200/50'
                        : 'hover:shadow-xl'
                    }`}
                    onClick={() => setSelectedSchedule(schedule)}
                  >
                    {/* Rounds and Courts Section */}
                    <div className="flex justify-between items-start mb-3">
                      {/* Rounds - Primary Focal Point */}
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg shadow-sm">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                          </svg>
                        </div>
                        <div className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                          {schedule.numRounds} Round{schedule.numRounds > 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      {/* Courts - Secondary Info */}
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-slate-100/80 to-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-200/40 backdrop-blur-sm">
                        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="6" width="18" height="12" rx="2"/>
                          <path d="M12 6v12"/>
                          <circle cx="8" cy="12" r="2"/>
                          <circle cx="16" cy="12" r="2"/>
                        </svg>
                        <span className="text-slate-700 font-medium text-xs">
                          {schedule.numCourts} court{schedule.numCourts > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    {/* Time Section - Enhanced with luxury aesthetic */}
                    <div className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-emerald-50/60 p-3 rounded-lg border border-emerald-200/30 backdrop-blur-sm">
                      <div className="p-1.5 bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-sm border border-slate-200/40">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 tracking-wide font-medium">Expected Run Time</div>
                        <div className="text-xs font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                          {formatTime(schedule.numRounds * 10)} - {formatTime(schedule.numRounds * 15)}
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

             {/* Ready to Start Pane */}
       {selectedSchedule && (
         <Card className="p-8 bg-white border border-slate-200/60">
           <CardContent className="text-center">
             <h3 className="text-xl font-semibold text-slate-900 mb-4">Ready to Start?</h3>
             <p className="text-slate-600 mb-6">Your tournament is configured and ready to begin</p>
             
             {/* Tournament Summary */}
             <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 mb-6 border border-emerald-200/50">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                 <div>
                   <span className="text-slate-500">Rounds:</span>
                   <p className="font-semibold text-slate-900">{selectedSchedule.numRounds}</p>
                 </div>
                 <div>
                   <span className="text-slate-500">Courts:</span>
                   <p className="font-semibold text-slate-900">{selectedSchedule.numCourts}</p>
                 </div>
                 <div>
                   <span className="text-slate-500">Players:</span>
                   <p className="font-semibold text-slate-900">{numPlayers}</p>
                 </div>
                 <div>
                   <span className="text-slate-500">Mode:</span>
                   <p className="font-semibold text-slate-900 capitalize">{gameMode}</p>
                 </div>
               </div>
             </div>
             
                          <div className="flex justify-center">
                <Button size="lg" onClick={handleStartSession} className="bg-emerald-600 hover:bg-emerald-700 px-8">
                  Start Tournament
                </Button>
              </div>
           </CardContent>
         </Card>
       )}
    </div>
  )
}
