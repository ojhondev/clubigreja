import Image from "next/image";

const ASPECT = 1412 / 328;

export function Logo({ height = 28, className = "" }: { height?: number; className?: string }) {
  return (
    <Image
      src="/dizipay-logo.png"
      alt="Dizipay"
      width={Math.round(height * ASPECT)}
      height={height}
      className={className}
      priority
    />
  );
}
