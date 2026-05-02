// app/dashboard/settings/platforms/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PlatformsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/settings?tab=platforms");
  }, [router]);
  return null;
}
