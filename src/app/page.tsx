import { ScheduleSelector } from '@/components/ScheduleSelector'

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            🏸 Badminton Schedule Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate match fixtures, track scores, and manage your badminton sessions locally.
          </p>
        </div>

        {/* Schedule Selection */}
        <ScheduleSelector />
      </div>
    </main>
  )
}
