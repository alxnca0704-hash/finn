import { Suspense } from "react"

import {
  GoalDetail,
  GoalDetailSkeleton,
} from "@/components/client/goals/goal-detail"

async function GoalDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <GoalDetail goalId={id} />
}

export default function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={<GoalDetailSkeleton />}>
      <GoalDetailRoute params={params} />
    </Suspense>
  )
}
