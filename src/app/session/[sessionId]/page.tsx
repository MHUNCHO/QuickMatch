'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SessionManager, TournamentSession } from '@/lib/session-manager'
import { BadmintonRules, MatchScore, LeaderboardEntry } from '@/lib/badminton-rules'

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<TournamentSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [scoreErrors, setScoreErrors] = useState<Record<string, string>>({})

  const sessionId = params.sessionId as string

  useEffect(() => {
    if (sessionId) {
      const loadedSession = SessionManager.getSession(sessionId)
      if (loadedSession) {
        console.log('Loaded session:', loadedSession)
        console.log('Generated schedule:', loadedSession.generatedSchedule)
        setSession(loadedSession)
        updateLeaderboard(loadedSession)
      } else {
        setError('Session not found')
      }
      setLoading(false)
    }
  }, [sessionId])

  const updateLeaderboard = (currentSession: TournamentSession) => {
    const stats = BadmintonRules.calculatePlayerStats(
      currentSession.players,
      currentSession.generatedSchedule
    )
    const newLeaderboard = BadmintonRules.generateLeaderboard(currentSession.players, stats)
    setLeaderboard(newLeaderboard)
  }

  const exportSessionResults = () => {
    if (!session) return

    // Prepare the data for export
    const exportData: {
      sessionInfo: {
        id: string
        date: string
        gameMode: string
        matchType: string
        competitionLevel: string
        numCourts: number
        totalPlayers: number
      }
      matches: Array<{
        round: number
        court: number
        team1: string
        team2: string
        score: string
        winner: string
      }>
      leaderboard: Array<{
        rank: number
        player: string
        wins: number
        losses: number
        winRate: string
        scoreDifference: number
      }>
    } = {
      sessionInfo: {
        id: session.id,
        date: session.configuration.date,
        gameMode: session.configuration.gameMode,
        matchType: session.configuration.matchType,
        competitionLevel: session.configuration.competitionLevel,
        numCourts: session.configuration.numCourts,
        totalPlayers: session.players.length
      },
      matches: session.generatedSchedule.map(match => ({
        round: match.round,
        court: match.court,
        team1: match.team1.join(' & '),
        team2: match.team2.join(' & '),
        score: match.score ? `${match.score.team1Score} - ${match.score.team2Score}` : 'Not played',
        winner: match.score ? (match.score.team1Score > match.score.team2Score ? 'Team 1' : 'Team 2') : 'N/A'
      })),
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        player: entry.player,
        wins: entry.wins,
        losses: entry.losses,
        winRate: `${entry.winRate.toFixed(1)}%`,
        scoreDifference: entry.scoreDifference
      }))
    }

    // Convert to CSV format
    const csvContent = generateCSV(exportData)
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `tournament-results-${session.id}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateCSV = (data: {
    sessionInfo: {
      id: string
      date: string
      gameMode: string
      matchType: string
      competitionLevel: string
      numCourts: number
      totalPlayers: number
    }
    matches: Array<{
      round: number
      court: number
      team1: string
      team2: string
      score: string
      winner: string
    }>
    leaderboard: Array<{
      rank: number
      player: string
      wins: number
      losses: number
      winRate: string
      scoreDifference: number
    }>
  }) => {
    let csv = ''

    // Session Info
    csv += 'Session Information\n'
    csv += 'ID,Date,Game Mode,Match Type,Competition Level,Courts,Total Players\n'
    csv += `${data.sessionInfo.id},${data.sessionInfo.date},${data.sessionInfo.gameMode},${data.sessionInfo.matchType},${data.sessionInfo.competitionLevel},${data.sessionInfo.numCourts},${data.sessionInfo.totalPlayers}\n\n`

    // Matches
    csv += 'Match Results\n'
    csv += 'Round,Court,Team 1,Team 2,Score,Winner\n'
    data.matches.forEach((match) => {
      csv += `${match.round},${match.court},"${match.team1}","${match.team2}","${match.score}","${match.winner}"\n`
    })
    csv += '\n'

    // Leaderboard
    csv += 'Final Leaderboard\n'
    csv += 'Rank,Player,Wins,Losses,Win Rate,Score Difference\n'
    data.leaderboard.forEach((entry) => {
      csv += `${entry.rank},"${entry.player}",${entry.wins},${entry.losses},${entry.winRate},${entry.scoreDifference}\n`
    })

    return csv
  }

  const handleScoreChange = (
    round: number,
    court: number,
    team1Score: number,
    team2Score: number
  ) => {
    if (!session) return

    const matchKey = `${round}-${court}`
    const score: MatchScore = { team1Score, team2Score }

    // Update match score immediately (allow typing)
    const updatedSchedule = session.generatedSchedule.map(match => {
      if (match.round === round && match.court === court) {
        return { ...match, score }
      }
      return match
    })

    const updatedSession = { ...session, generatedSchedule: updatedSchedule }
    setSession(updatedSession)

    // Save to localStorage
    SessionManager.updateSession(sessionId, { generatedSchedule: updatedSchedule })

    // Always validate when both scores are present
    const validation = BadmintonRules.validateScore(score)
    if (!validation.isValid) {
      setScoreErrors(prev => ({ ...prev, [matchKey]: validation.error! }))
    } else {
      // Clear error if score is valid
      setScoreErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[matchKey]
        return newErrors
      })
      // Update leaderboard only when score is valid
      updateLeaderboard(updatedSession)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading tournament session...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Session Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The requested tournament session could not be found.'}</p>
          <Button onClick={() => router.push('/tournament')}>
            Back to Tournament Generator
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tournament Session</h1>
              <p className="text-slate-600 mt-2">Session ID: {session.id}</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => router.push('/tournament')}>
                Back to Generator
              </Button>
              <Button 
                onClick={() => exportSessionResults()}
              >
                Export Results
              </Button>
            </div>
          </div>
        </div>

        {/* Session Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tournament Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="text-sm font-medium text-slate-500">Game Mode</span>
                <p className="text-lg font-semibold text-slate-900 capitalize">{session.configuration.gameMode}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-500">Match Type</span>
                <p className="text-lg font-semibold text-slate-900 capitalize">{session.configuration.matchType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-500">Date</span>
                <p className="text-lg font-semibold text-slate-900">{session.configuration.date}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-500">Level</span>
                <p className="text-lg font-semibold text-slate-900 capitalize">{session.configuration.competitionLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Schedule */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tournament Schedule</CardTitle>
            <p className="text-slate-600">
              {session.selectedSchedule.numRounds} rounds • {session.configuration.numCourts} courts • {session.players.length} players
            </p>
          </CardHeader>
          <CardContent>
            {session.generatedSchedule.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No matches generated</h3>
                <p className="text-slate-600 mb-4">The schedule generation failed. Check the console for debugging information.</p>
                <div className="bg-slate-100 p-4 rounded-lg text-left text-sm">
                  <p><strong>Debug Info:</strong></p>
                  <p>Players: {session.players.join(', ')}</p>
                  <p>Match Type: {session.configuration.matchType}</p>
                  <p>Schedule Pairings: {JSON.stringify(session.selectedSchedule.pairings, null, 2)}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {Array.from({ length: session.selectedSchedule.numRounds }, (_, roundIndex) => {
                  const roundNumber = roundIndex + 1
                  const roundMatches = session.generatedSchedule.filter(match => match.round === roundNumber)
                  
                  return (
                    <div key={roundIndex} className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                          </svg>
                        </div>
                        <span className="bg-gradient-to-br from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                          Round {roundNumber}
                        </span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {roundMatches.map((match, matchIndex) => (
                          <div key={matchIndex} className="bg-slate-100 border border-slate-200 rounded-lg pt-12 pb-4 px-4 relative">
                            {/* Court Header */}
                            <div className="absolute top-0 left-0 right-0 bg-slate-200 rounded-t-lg px-4 py-1 border-b border-slate-300">
                              <div className="flex items-center">
                                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Court {match.court}</span>
                              </div>
                            </div>
                            
                            {/* Score Element - Positioned to overlap header */}
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-lg font-bold text-lg flex items-center shadow-lg">
                                <input 
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  className="w-9 h-10 text-center bg-transparent text-white font-bold text-lg border-none outline-none cursor-pointer hover:bg-black/20 hover:rounded-sm transition-colors duration-100 m-1"
                                  value={match.score?.team1Score || ''}
                                  onChange={(e) => {
                                    const score = parseInt(e.target.value) || 0
                                    handleScoreChange(match.round, match.court, score, match.score?.team2Score || 0)
                                  }}
                                  placeholder="0"
                                  title="Click to edit score"
                                />
                                <span className="px-1 text-white">:</span>
                                <input 
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  className="w-9 h-10 text-center bg-transparent text-white font-bold text-lg border-none outline-none cursor-pointer hover:bg-black/20 hover:rounded-sm transition-colors duration-100 m-1"
                                  value={match.score?.team2Score || ''}
                                  onChange={(e) => {
                                    const score = parseInt(e.target.value) || 0
                                    handleScoreChange(match.round, match.court, match.score?.team1Score || 0, score)
                                  }}
                                  placeholder="0"
                                  title="Click to edit score"
                                />
                              </div>
                            </div>
                            

                            
                            {/* Teams Section */}
                            <div className="flex justify-between items-center mb-4">
                              {/* Team 1 - Left Side */}
                              <div className="flex flex-col items-start space-y-2 w-1/3">
                                <div className="text-xs text-slate-500 text-left w-full">Team 1</div>
                                {match.team1.map((player, playerIndex) => (
                                  <div key={playerIndex} className="flex items-center gap-2 w-full">
                                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 truncate">{player}</span>
                                  </div>
                                ))}
                              </div>
                              
                              {/* VS Element with Connecting Line */}
                              <div className="relative flex flex-col items-center flex-shrink-0">
                                {/* Vertical Line */}
                                <div className="w-px h-24 bg-slate-300 absolute left-1/2 transform -translate-x-1/2 top-0 z-0"></div>
                                <div className="w-px bg-slate-300 absolute left-1/2 transform -translate-x-1/2 -top-12 bottom-8 z-0"></div>
                                
                                {/* VS Circle */}
                                <div className="bg-white border-2 border-slate-300 rounded-full w-12 h-12 flex items-center justify-center z-10 relative">
                                  <span className="text-sm font-semibold text-slate-600">VS</span>
                                </div>
                              </div>
                              
                              {/* Team 2 - Right Side */}
                              <div className="flex flex-col items-end space-y-2 w-1/3">
                                <div className="text-xs text-slate-500 text-right w-full">Team 2</div>
                                {match.team2.map((player, playerIndex) => (
                                  <div key={playerIndex} className="flex items-center gap-2 w-full justify-end">
                                    <span className="text-sm font-medium text-slate-700 truncate">{player}</span>
                                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Score Error Display */}
                            {scoreErrors[`${match.round}-${match.court}`] && (
                              <div className="mt-2 text-xs text-red-600 text-center">
                                {scoreErrors[`${match.round}-${match.court}`]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Bench Section - Players Not Playing This Round */}
                      <div className="mt-4 text-sm text-slate-600">
                        {(() => {
                          // Get all players participating in this round only
                          const playingPlayers = new Set<string>()
                          
                          roundMatches.forEach(match => {
                            if (match.team1 && Array.isArray(match.team1)) {
                              match.team1.forEach(player => playingPlayers.add(player))
                            }
                            if (match.team2 && Array.isArray(match.team2)) {
                              match.team2.forEach(player => playingPlayers.add(player))
                            }
                          })
                          
                          // Find players not playing in this round
                          const benchPlayers = session.players.filter(player => !playingPlayers.has(player))
                          
                          if (benchPlayers.length === 0) {
                            return null
                          }
                          
                          return (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M15 9l-6 6" />
                                <path d="M9 9l6 6" />
                              </svg>
                              <span>Sitting Out: {benchPlayers.join(', ')}</span>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <p className="text-slate-600">
              Player rankings based on match results
            </p>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No matches completed yet. Start entering scores to see the leaderboard!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Rank</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Player</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Wins</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Losses</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Win Rate</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">Score Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.player} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                              }`}>
                                {index + 1}
                              </div>
                            ) : (
                              <span className="text-slate-500 font-medium">{index + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">{entry.player}</td>
                        <td className="py-3 px-4 text-center text-emerald-600 font-semibold">{entry.wins}</td>
                        <td className="py-3 px-4 text-center text-red-600 font-semibold">{entry.losses}</td>
                        <td className="py-3 px-4 text-center text-slate-700">
                          {entry.winRate.toFixed(1)}%
                        </td>
                        <td className={`py-3 px-4 text-center font-semibold ${
                          entry.scoreDifference > 0 ? 'text-emerald-600' : 
                          entry.scoreDifference < 0 ? 'text-slate-500' : 'text-red-600'
                        }`}>
                          {entry.scoreDifference > 0 ? '+' : ''}{entry.scoreDifference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
