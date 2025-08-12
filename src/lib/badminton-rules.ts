import { ScoreValidation, BADMINTON_RULES } from './types'

/**
 * Validates badminton scores according to official rules
 */
export function validateBadmintonScore(score1: number, score2: number): ScoreValidation {
  // Check for negative scores
  if (score1 < 0 || score2 < 0) {
    return {
      isValid: false,
      error: 'Scores cannot be negative'
    }
  }

  // Check if scores exceed maximum
  if (score1 > BADMINTON_RULES.MAX_SCORE || score2 > BADMINTON_RULES.MAX_SCORE) {
    return {
      isValid: false,
      error: `Scores cannot exceed ${BADMINTON_RULES.MAX_SCORE}`
    }
  }

  // Determine winner and loser
  const [winnerScore, loserScore] = score1 > score2 ? [score1, score2] : [score2, score1]
  const isWinner1 = score1 > score2

  // Check if winner reached winning score
  if (winnerScore < BADMINTON_RULES.WINNING_SCORE) {
    return {
      isValid: false,
      error: `Winner must score at least ${BADMINTON_RULES.WINNING_SCORE} points`
    }
  }

  // Check win margin rules
  if (winnerScore === BADMINTON_RULES.MAX_SCORE) {
    // At 30, any margin is acceptable
    return { isValid: true }
  }

  if (winnerScore >= BADMINTON_RULES.DEUCE_THRESHOLD) {
    // From 20 onwards, must win by 2
    if (winnerScore - loserScore < BADMINTON_RULES.MIN_WIN_MARGIN) {
      return {
        isValid: false,
        error: `From ${BADMINTON_RULES.DEUCE_THRESHOLD} points, must win by at least ${BADMINTON_RULES.MIN_WIN_MARGIN}`
      }
    }
  }

  return { isValid: true }
}

/**
 * Determines the winner of a match
 */
export function getMatchWinner(match: { score1: number; score2: number }): 'player1' | 'player2' | null {
  if (match.score1 === 0 && match.score2 === 0) return null
  
  const validation = validateBadmintonScore(match.score1, match.score2)
  if (!validation.isValid) return null
  
  return match.score1 > match.score2 ? 'player1' : 'player2'
}

/**
 * Checks if a match is a draw (impossible in badminton but useful for validation)
 */
export function isMatchDraw(match: { score1: number; score2: number }): boolean {
  return match.score1 === match.score2 && match.score1 > 0
}

/**
 * Gets the match duration in minutes
 */
export function getMatchDuration(match: { startTime?: Date; endTime?: Date }): number | null {
  if (!match.startTime || !match.endTime) return null
  
  const durationMs = match.endTime.getTime() - match.startTime.getTime()
  return Math.round(durationMs / (1000 * 60)) // Convert to minutes
}
