import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
  backHref = "/",
}: {
  title: string;
  description?: string;
  backHref?: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-white px-3 py-6 sm:px-4 lg:pl-5 lg:pr-8">
      <div className="flex w-full max-w-[1600px] items-start gap-4">
        <Link href={backHref}>
          <Button variant="outline" size="sm" className="mt-0.5">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#003F72]">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
