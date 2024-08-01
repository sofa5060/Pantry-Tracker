"use client";
import Navbar from "@/components/common/Navbar";
import PantryList from "@/components/pantry/PantryList";
import { Button } from "@/components/ui/button";
import { PantryManager } from "@/managers/PantryManager";
import { useQuery } from "@tanstack/react-query";
import { InfinitySpin } from "react-loader-spinner";

export default function Home() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pantries"],
    queryFn: PantryManager.getItems,
  });

  return (
    <main>
      <Navbar />
      {isLoading && (
        <div className="flex items-center w-full justify-center">
          <InfinitySpin width="200" color="#4fa94d" />
        </div>
      )}
      {isError && (
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-red-500">
            Failed to load pantry items. Please try again.
          </p>
          <Button onClick={async () => await refetch()}>Refetch</Button>
        </div>
      )}
      {!isLoading && !isError && <PantryList pantryItems={data!} />}
    </main>
  );
}
