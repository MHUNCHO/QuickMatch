export interface MatchScore {
  team1Score: number
  team2Score: number
}

export interface PlayerStats {
  wins: number
  losses: number
  scoreDifference: number
}

export interface LeaderboardEntry {
  player: string
  wins: number
  losses: number
  scoreDifference: number
  winRate: number
}

export class BadmintonRules {
  /**
   * Validates a badminton match score according to official rules
   */
  static validateScore(score: MatchScore): { isValid: boolean; error?: string } {
    const { team1Score, team2Score } = score

    // Check for valid numbers
    if (typeof team1Score !== 'number' || typeof team2Score !== 'number') {
      return { isValid: false, error: 'Scores must be numbers' }
    }

    // Check for non-negative integers
    if (!Number.isInteger(team1Score) || !Number.isInteger(team2Score)) {
      return { isValid: false, error: 'Scores must be whole numbers' }
    }

    if (team1Score < 0 || team2Score < 0) {
      return { isValid: false, error: 'Scores cannot be negative' }
    }

    // Check for no draw
    if (team1Score === team2Score) {
      return { isValid: false, error: 'Match cannot end in a draw' }
    }

    const winner = Math.max(team1Score, team2Score)
    const loser = Math.min(team1Score, team2Score)

    // Winner must be at least 21
    if (winner < 21) {
      return { isValid: false, error: 'Winner must score at least 21 points' }
    }

    // Winner cannot exceed 30
    if (winner > 30) {
      return { isValid: false, error: 'Winner cannot score more than 30 points' }
    }

    // If loser is below 20, winner must be exactly 21
    if (loser < 20 && winner !== 21) {
      return { isValid: false, error: 'If opponent scores less than 20, winner must score exactly 21' }
    }

    // From 20 all onward, win by exactly 2 points, up to 30
    if (loser >= 20) {
      const difference = winner - loser
      
      // Special edge case: 30-29 is valid (30-point cap rule)
      if (winner === 30 && loser === 29) {
        return { isValid: true }
      }
      
      // Otherwise, must win by exactly 2 points
      if (difference !== 2) {
        return { isValid: false, error: 'From 20 all onward, must win by exactly 2 points' }
      }
    }

    return { isValid: true }
  }

  /**
   * Determines the winner of a match
   */
  static getWinner(score: MatchScore): 'team1' | 'team2' | null {
    if (score.team1Score === score.team2Score) return null
    return score.team1Score > score.team2Score ? 'team1' : 'team2'
  }

  /**
   * Calculates player statistics from match results
   */
  static calculatePlayerStats(
    players: string[],
    matches: Array<{
      round: number
      court: number
      team1: string[]
      team2: string[]
      matchType: 'doubles' | 'singles'
      score?: MatchScore
    }>
  ): Record<string, PlayerStats> {
    const stats: Record<string, PlayerStats> = {}
    
    // Initialize stats for all players
    players.forEach(player => {
      stats[player] = { wins: 0, losses: 0, scoreDifference: 0 }
    })

    // Process each match with validation
    matches.forEach(match => {
      if (!match.score) return

      // Validate score before processing
      const validation = BadmintonRules.validateScore(match.score)
      if (!validation.isValid) {
        console.warn(`Invalid score in match: ${validation.error}`, match)
        return
      }

      const winner = BadmintonRules.getWinner(match.score)
      if (!winner) return

      const winningTeam = winner === 'team1' ? match.team1 : match.team2
      const losingTeam = winner === 'team1' ? match.team2 : match.team1
      const scoreDiff = Math.abs(match.score.team1Score - match.score.team2Score)

      // Update stats for each player
      winningTeam.forEach(player => {
        if (stats[player]) {
          stats[player].wins++
          stats[player].scoreDifference += scoreDiff
        }
      })

      losingTeam.forEach(player => {
        if (stats[player]) {
          stats[player].losses++
          stats[player].scoreDifference -= scoreDiff
        }
      })
    })

    return stats
  }

  /**
   * Generates a sorted leaderboard from player statistics
   */
  static generateLeaderboard(
    players: string[],
    stats: Record<string, PlayerStats>
  ): LeaderboardEntry[] {
    return players
      .filter(player => stats[player]) // Ensure player exists in stats
      .map(player => {
        const playerStats = stats[player]
        const totalGames = playerStats.wins + playerStats.losses
        const winRate = totalGames > 0 ? Number(((playerStats.wins / totalGames) * 100).toFixed(2)) : 0

        return {
          player,
          wins: playerStats.wins,
          losses: playerStats.losses,
          scoreDifference: playerStats.scoreDifference,
          winRate
        }
      })
      .sort((a, b) => {
        // Sort by wins (descending), then by win rate (descending), then by score difference (descending)
        if (a.wins !== b.wins) return b.wins - a.wins
        if (a.winRate !== b.winRate) return b.winRate - a.winRate
        return b.scoreDifference - a.scoreDifference
      })
  }
}
