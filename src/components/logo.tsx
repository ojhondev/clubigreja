import Image from "next/image";

const ASPECT = 918 / 241;

export function Logo({ height = 28, className = "" }: { height?: number; className?: string }) {
  return (
    <Image
      src="/logo-club.png"
      alt="Club Igreja"
      width={Math.round(height * ASPECT)}
      height={height}
      className={className}
      priority
    />
  );
}
