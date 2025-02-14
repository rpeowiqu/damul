import { ReactNode, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface DamulHoverCardProps {
  hoverCardTrigger: ReactNode;
  children: ReactNode;
  className?: string;
}

const DamulHoverCard = ({
  hoverCardTrigger,
  children,
  className,
}: DamulHoverCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger
        onPointerEnter={() => setIsOpen(true)}
        onPointerLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {hoverCardTrigger}
      </HoverCardTrigger>
      <HoverCardContent
        className={`w-fit p-2 text-normal-400 bg-white border rounded shadow ${className}`}
      >
        {children}
      </HoverCardContent>
    </HoverCard>
  );
};

export default DamulHoverCard;
