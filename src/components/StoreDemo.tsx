'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function StoreDemo() {
  const { count, increment, decrement } = useAppStore()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Zustand State Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>Counter Example</CardTitle>
          <CardDescription>
            This demonstrates Zustand state management with persistence.
            The counter value is stored in localStorage and persists across page reloads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-4">{count}</div>
            <div className="flex gap-2 justify-center">
              <Button onClick={decrement} variant="outline" size="lg">
                -
              </Button>
              <Button onClick={increment} size="lg">
                +
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Try changing the value and refreshing the page to see persistence in action!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
