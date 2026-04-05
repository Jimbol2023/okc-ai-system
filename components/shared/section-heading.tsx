import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
      <h1 className="font-serif text-3xl text-primary md:text-5xl">{title}</h1>
      <p className="max-w-2xl text-sm leading-6 text-muted md:text-base">{description}</p>
    </div>
  );
}
