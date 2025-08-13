import { ScheduleSelector } from '@/components/ScheduleSelector'

export default function TournamentPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Tournament Generator</h1>
          <p className="text-slate-600 mt-2">Create and configure your badminton tournament schedules</p>
        </div>
        <ScheduleSelector />
      </div>
    </div>
  )
}
