import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative w-full h-3 overflow-hidden rounded-full grow bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-positive-200" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block w-5 h-5 border-2 rounded-full bg-positive-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border-positive-300" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
