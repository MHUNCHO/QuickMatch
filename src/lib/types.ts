// Core types for the badminton schedule generator

export interface Player {
  id: string
  name: string
  wins: number
  losses: number
  pointsFor: number
  pointsAgainst: number
  plusMinus: number
}

export interface Match {
  id: string
  round: number
  court: number
  player1Id: string
  player2Id: string
  score1: number
  score2: number
  isCompleted: boolean
  isSkipped: boolean
  startTime?: Date
  endTime?: Date
}

export interface Schedule {
  id: string
  name: string
  numCourts: number
  numRounds: number
  numPlayers: number
  pairings: number[][][][] // Array of rounds, each round has array of courts, each court has array of teams, each team has array of players
  createdAt: Date
}

export interface Session {
  id: string
  scheduleId: string
  date: Date
  players: Player[]
  matches: Match[]
  currentRound: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ScoreValidation {
  isValid: boolean
  error?: string
}

// Badminton scoring rules
export const BADMINTON_RULES = {
  WINNING_SCORE: 21,
  MIN_WIN_MARGIN: 2,
  MAX_SCORE: 30,
  DEUCE_THRESHOLD: 20
} as const
