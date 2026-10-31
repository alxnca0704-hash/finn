import { Button } from "@/components/client/ui/button";
import { Input } from "@/components/client/ui/input";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Input placeholder="Enter an amount" />
        <Button>Save</Button>
      </div>
    </main>
  );
}
