import { Suspense } from "react";

import { AntUpload } from "@/components/client/upload/ant-upload";
import { DatePicker } from "@/components/client/ui/date-picker";
import { Progress } from "@/components/client/ui/progress";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Progress value={64} />
        <DatePicker />
        <Suspense fallback={null}>
          <AntUpload />
        </Suspense>
      </div>
    </main>
  );
}
