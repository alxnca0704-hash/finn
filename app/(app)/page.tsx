import { GoalsSection } from "@/components/client/goals/goals-section"
import { HomeProfile } from "@/components/client/home/home-profile"
import { PostAuthRedirect } from "@/components/client/auth/post-auth-redirect"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-8 sm:px-6 sm:py-12">
      {process.env.NEXT_PUBLIC_CONVEX_URL && <PostAuthRedirect />}
      <div className="flex w-full max-w-5xl justify-end">
        <HomeProfile />
      </div>
      <GoalsSection />
    </main>
  )
}
