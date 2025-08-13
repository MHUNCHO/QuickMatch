import { Suspense } from 'react'
import { ScheduleSelector } from '@/components/ScheduleSelector'

export default function TournamentPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Tournament Generator</h1>
          <p className="text-slate-600 mt-2">Create and configure your badminton tournament schedules</p>
        </div>
        <Suspense fallback={
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading tournament generator...</p>
          </div>
        }>
          <ScheduleSelector />
        </Suspense>
      </div>
    </div>
  )
}
