import { NextResponse } from "next/server";
import { getNassibBundle } from "@/lib/nassib";

export async function GET() {
  const { reserves } = getNassibBundle();
  const header = "number,date,room,zone,lot,company,title,severity,status,due_date,blocks_reception\n";
  const rows = reserves
    .map(
      (r) =>
        `${r.number},${r.date},${r.roomCode ?? ""},${r.zone},${r.lotCode},${r.company},"${r.title.replace(/"/g, '""')}",${r.severity},${r.status},${r.dueDate},${r.blocksReception}`,
    )
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="NASSIB-reserves.csv"',
    },
  });
}
