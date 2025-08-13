import { Schedule } from './types'

export interface TournamentSession {
  id: string
  createdAt: string
  updatedAt: string
  configuration: {
    numCourts: number
    gameMode: string
    matchType: string
    date: string
    competitionLevel: string
  }
  players: string[]
  selectedSchedule: Schedule
  generatedSchedule: GeneratedMatch[]
}

export interface GeneratedMatch {
  round: number
  court: number
  team1: string[]
  team2: string[]
  matchType: 'doubles' | 'singles'
  score?: {
    team1Score: number
    team2Score: number
  }
}

export class SessionManager {
  private static STORAGE_KEY = 'quickmatch_sessions'
  private static SESSION_ID_PREFIX = 'session'

  // Generate a unique session ID
  static generateSessionId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `${this.SESSION_ID_PREFIX}-${timestamp}-${random}`
  }

  // Save session to localStorage
  static saveSession(session: TournamentSession): void {
    try {
      const existingSessions = this.getAllSessions()
      const updatedSessions = {
        ...existingSessions,
        [session.id]: session
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSessions))
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  // Get a specific session by ID
  static getSession(sessionId: string): TournamentSession | null {
    try {
      const sessions = this.getAllSessions()
      return sessions[sessionId] || null
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }

  // Get all sessions
  static getAllSessions(): Record<string, TournamentSession> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Failed to get sessions:', error)
      return {}
    }
  }

  // Delete a session
  static deleteSession(sessionId: string): void {
    try {
      const sessions = this.getAllSessions()
      delete sessions[sessionId]
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  // Generate the actual tournament schedule from numeric pairings
  static generateTournamentSchedule(
    schedule: Schedule,
    players: string[],
    matchType: 'doubles' | 'singles'
  ): GeneratedMatch[] {
    const matches: GeneratedMatch[] = []
    
    console.log('Generating schedule for:', { schedule, players, matchType })
    console.log('Schedule pairings:', schedule.pairings)
    
    schedule.pairings.forEach((roundPairings, roundIndex) => {
      console.log(`Round ${roundIndex + 1} pairings:`, roundPairings)
      
      roundPairings.forEach((courtPairing, courtIndex) => {
        console.log(`Court ${courtIndex + 1} pairing:`, courtPairing)
        
        if (matchType === 'doubles') {
          // For doubles, CSV contains team pairs: (team1_player1, team1_player2);(team2_player1, team2_player2)
          // Each court has 2 teams, each team has 2 players
          if (courtPairing.length === 2) {
            // courtPairing[0] = first team, courtPairing[1] = second team
            const team1Player1Index = courtPairing[0][0] as number
            const team1Player2Index = courtPairing[0][1] as number
            const team2Player1Index = courtPairing[1][0] as number
            const team2Player2Index = courtPairing[1][1] as number
            
            const team1 = [players[team1Player1Index], players[team1Player2Index]]
            const team2 = [players[team2Player1Index], players[team2Player2Index]]
            
            matches.push({
              round: roundIndex + 1,
              court: courtIndex + 1,
              team1,
              team2,
              matchType: 'doubles'
            })
          }
        } else {
          // For singles, each pairing is 2 numbers representing 2 players
          if (courtPairing.length === 2) {
            // For singles, courtPairing[0] and courtPairing[1] are arrays with single player indices
            const player1Index = (courtPairing[0] as number[])[0] as number
            const player2Index = (courtPairing[1] as number[])[0] as number
            
            const team1 = [players[player1Index]]
            const team2 = [players[player2Index]]
            
            matches.push({
              round: roundIndex + 1,
              court: courtIndex + 1,
              team1,
              team2,
              matchType: 'singles'
            })
          }
        }
      })
    })
    
    console.log('Generated matches:', matches)
    return matches
  }

  // Create a new session
  static createSession(
    configuration: TournamentSession['configuration'],
    players: string[],
    selectedSchedule: Schedule
  ): TournamentSession {
    // Randomize player order to prevent predictable matchups
    const randomizedPlayers = [...players].sort(() => Math.random() - 0.5)
    
    const session: TournamentSession = {
      id: this.generateSessionId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      configuration,
      players: randomizedPlayers, // Use randomized order
      selectedSchedule,
      generatedSchedule: this.generateTournamentSchedule(
        selectedSchedule,
        randomizedPlayers, // Use randomized order for schedule generation
        configuration.matchType as 'doubles' | 'singles'
      )
    }
    
    this.saveSession(session)
    return session
  }

  // Update an existing session
  static updateSession(sessionId: string, updates: Partial<TournamentSession>): TournamentSession | null {
    const session = this.getSession(sessionId)
    if (!session) return null
    
    const updatedSession: TournamentSession = {
      ...session,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.saveSession(updatedSession)
    return updatedSession
  }
}
