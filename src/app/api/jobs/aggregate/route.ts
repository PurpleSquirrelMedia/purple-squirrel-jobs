import { NextResponse } from "next/server";
import { aggregateJobs } from "@/lib/services/job-aggregator";

export async function POST() {
  try {
    // In production, add authentication check here
    // const session = await auth();
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const result = await aggregateJobs();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error aggregating jobs:", error);
    return NextResponse.json(
      { error: "Failed to aggregate jobs" },
      { status: 500 }
    );
  }
}
