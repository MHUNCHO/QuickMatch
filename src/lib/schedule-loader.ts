import { Schedule } from './types'

// CSV schedule data structure
interface CsvScheduleRow {
  num_players: number
  num_rounds: number
  round_index: number
  pairs: string
}

/**
 * Parses the pairs string from CSV format "(0,3);(1,2);(4,5);(6,7)"
 * Returns array of player pairs for each court
 */
function parsePairs(pairsString: string): number[][] {
  return pairsString
    .split(';')
    .map(pair => {
      const match = pair.match(/\((\d+),(\d+)\)/)
      if (match) {
        return [parseInt(match[1]), parseInt(match[2])]
      }
      return [0, 0]
    })
    .filter(pair => pair[0] !== 0 || pair[1] !== 0)
}

/**
 * Loads schedules from CSV data
 */
export function loadSchedulesFromCsv(csvData: CsvScheduleRow[]): Schedule[] {
  const scheduleMap = new Map<string, Schedule>()
  
  csvData.forEach(row => {
    const key = `${row.num_players}-${row.num_rounds}`
    
    if (!scheduleMap.has(key)) {
      // Create new schedule
      scheduleMap.set(key, {
        id: `schedule-${row.num_players}-${row.num_rounds}`,
        name: `${row.num_players} Players - ${row.num_rounds} Rounds`,
        numCourts: 2, // All CSV files are for 2 courts
        numRounds: row.num_rounds,
        numPlayers: row.num_players,
        pairings: new Array(row.num_rounds).fill([]).map(() => []),
        createdAt: new Date()
      })
    }
    
    const schedule = scheduleMap.get(key)!
    // Add the round data to the pairings
    schedule.pairings[row.round_index] = parsePairs(row.pairs)
  })
  
  return Array.from(scheduleMap.values())
}

/**
 * Gets schedules for a specific number of courts
 */
export function getSchedulesByCourts(numCourts: number): Schedule[] {
  // For now, we only have 2-court schedules in CSV
  // TODO: Load other court configurations when available
  if (numCourts !== 2) {
    return []
  }
  
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
export function getScheduleById(id: string): Schedule | undefined {
  // This will be populated when we load the actual CSV data
  return undefined
}
