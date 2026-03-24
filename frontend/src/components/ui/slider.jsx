import * as React from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils"; // This should be your classNames helper

export const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <RadixSlider.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <RadixSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
      <RadixSlider.Range className="absolute h-full bg-blue-500" />
    </RadixSlider.Track>
    <RadixSlider.Thumb className="block h-4 w-4 rounded-full bg-white border border-blue-500 shadow" />
  </RadixSlider.Root>
));
Slider.displayName = "Slider";
