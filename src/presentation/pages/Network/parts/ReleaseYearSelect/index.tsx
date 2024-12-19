import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { yearRange } from "@/src/consts/year-range";

type ReleaseYearSelectProps = {
  selectedReleaseYears: number[] | undefined;
  // e.g. [1990, 1991, ... , 2000] or undefined
  setSelectedReleaseYears: (selectedReleaseYears: number[] | undefined) => void;
};

export const ReleaseYearSelect: React.FC<ReleaseYearSelectProps> = ({
  selectedReleaseYears,
  setSelectedReleaseYears,
}) => {
  const actualSelectedYears =
    selectedReleaseYears ??
    Array.from({ length: yearRange.end - yearRange.start + 1 }, (_, i) => yearRange.start + i);

  // スライダーは[start, end]を利用
  const sliderValue: [number, number] = [
    actualSelectedYears[0],
    actualSelectedYears[actualSelectedYears.length - 1],
  ];

  const handleValueChange = (value: number[]) => {
    const [start, end] = value as [number, number];
    const allYears = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    setSelectedReleaseYears(allYears);
  };

  return (
    <div className="flex space-x-2 items-end">
      <div className="h-12 flex items-center">
        <Slider
          min={yearRange.start}
          max={yearRange.end}
          value={sliderValue}
          step={1}
          onValueChange={handleValueChange}
          className="w-[400px]"
        />
      </div>
      <Button
        onClick={() => setSelectedReleaseYears(undefined)}
        className="flex items-start ml-4 px-2 py-1 bg-inherit text-slate-600 rounded-none shadow-none text-sm font-semibold hover:bg-inherit hover:text-sky-400"
      >
        clear
      </Button>
    </div>
  );
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const valueArray = value as [number, number];
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
        {/* 中央範囲部分を別の色に */}
        <SliderPrimitive.Range className="absolute h-full bg-sky-300" />
      </SliderPrimitive.Track>

      {/* 開始年用Thumb */}
      <SliderPrimitive.Thumb className="relative block h-4 w-4 rounded-full bg-sky-400 shadow transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold px-1 py-0.5 rounded">
          {valueArray[0]}
        </div>
      </SliderPrimitive.Thumb>

      {/* 終了年用Thumb */}
      <SliderPrimitive.Thumb className="relative block h-4 w-4 rounded-full bg-sky-400 shadow transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2  text-xs font-semibold px-1 py-0.5">
          {valueArray[1]}
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;
