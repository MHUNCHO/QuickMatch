import { Schedule } from './types'

// CSV schedule data structure
interface CsvScheduleRow {
  num_players: number
  num_rounds: number
  round_index: number
  pairs: string
}

/**
 * Parses the pairs string from CSV format 
 * For doubles: "(0,3);(1,2)" -> returns [[[0,3], [1,2]]] (2 teams per court)
 * Returns array of teams for each court, where each team is an array of 2 players
 */
function parsePairs(pairsString: string, numCourts: number): number[][][] {
  const pairs = pairsString
    .split(';')
    .map(pair => {
      const match = pair.match(/\(([^)]+)\)/)
      if (match) {
        const players = match[1].split(',').map(p => parseInt(p.trim()))
        return players
      }
      return []
    })
    .filter(pair => pair.length > 0)

  // Group teams by court (2 teams per court for doubles)
  const courtPairings: number[][][] = []
  for (let court = 0; court < numCourts; court++) {
    const courtIndex = court * 2
    if (pairs[courtIndex] && pairs[courtIndex + 1]) {
      // Each court has 2 teams
      courtPairings.push([pairs[courtIndex], pairs[courtIndex + 1]])
    } else {
      courtPairings.push([]) // Empty court
    }
  }

  return courtPairings
}

/**
 * Loads schedules from CSV data
 */
export function loadSchedulesFromCsv(csvData: CsvScheduleRow[], numCourts: number): Schedule[] {
  const scheduleMap = new Map<string, Schedule>()
  
  csvData.forEach(row => {
    const key = `${row.num_players}-${row.num_rounds}`
    
    if (!scheduleMap.has(key)) {
      // Create new schedule
      scheduleMap.set(key, {
        id: `schedule-${row.num_players}-${row.num_rounds}`,
        name: `${row.num_players} Players - ${row.num_rounds} Rounds`,
        numCourts: numCourts,
        numRounds: row.num_rounds,
        numPlayers: row.num_players,
        pairings: new Array(row.num_rounds).fill([]).map(() => []),
        createdAt: new Date()
      })
    }
    
    const schedule = scheduleMap.get(key)!
    // Add the round data to the pairings
    schedule.pairings[row.round_index] = parsePairs(row.pairs, numCourts)
  })
  
  return Array.from(scheduleMap.values())
}

/**
 * Gets schedules for a specific number of courts
 */
export function getSchedulesByCourts(_numCourts: number): Schedule[] {
  // This will be populated when we load the actual CSV data
  return []
}

/**
 * Gets all available schedules
 */
export function getAllSchedules(): Schedule[] {
  // This will be populated when we load the actual CSV data
  return []
}

/**
 * Gets a schedule by ID
 */
export function getScheduleById(_id: string): Schedule | undefined {
  // This will be populated when we load the actual CSV data
  return undefined
}
