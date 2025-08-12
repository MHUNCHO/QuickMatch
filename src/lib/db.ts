import Dexie, { Table } from 'dexie'

// Define your data types
export interface ExampleItem {
  id?: number
  name: string
  description?: string
  createdAt: Date
}

// Extend Dexie to add your tables
export class AppDatabase extends Dexie {
  examples!: Table<ExampleItem>

  constructor() {
    super('AppDatabase')
    this.version(1).stores({
      examples: '++id, name, createdAt'
    })
  }
}

// Create and export a single instance
export const db = new AppDatabase()

// Helper functions for common operations
export const dbHelpers = {
  async addExample(item: Omit<ExampleItem, 'id' | 'createdAt'>) {
    return await db.examples.add({
      ...item,
      createdAt: new Date()
    })
  },

  async getAllExamples() {
    return await db.examples.toArray()
  },

  async deleteExample(id: number) {
    return await db.examples.delete(id)
  }
}
