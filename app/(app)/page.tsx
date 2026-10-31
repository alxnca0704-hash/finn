import { Suspense } from "react"

import { HomeProfile } from "@/components/client/home/home-profile"
import { PostAuthRedirect } from "@/components/client/auth/post-auth-redirect"
import { AntUpload } from "@/components/client/upload/ant-upload"
import { DatePicker } from "@/components/client/ui/date-picker"
import { Progress } from "@/components/client/ui/progress"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8 sm:py-12">
      <div className="flex w-full max-w-5xl justify-end">
        <HomeProfile />
      </div>
      {process.env.NEXT_PUBLIC_CONVEX_URL && <PostAuthRedirect />}
      <section className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <Progress value={64} />
          <DatePicker />
          <Suspense fallback={null}>
            <AntUpload />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
