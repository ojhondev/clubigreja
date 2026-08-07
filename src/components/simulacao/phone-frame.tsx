import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[270px] rounded-[2.5rem] border-[8px] border-black bg-black shadow-2xl sm:w-[300px]">
      <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />
      <div className="flex h-[540px] flex-col overflow-hidden rounded-[2rem] bg-[#F7FAFF] p-4 sm:h-[580px]">
        {children}
      </div>
    </div>
  );
}
