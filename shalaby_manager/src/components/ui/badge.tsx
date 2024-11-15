import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { ny } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-border text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/50",
        destructive:
          "border-transparent bg-destructive/60 text-destructive-foreground hover:bg-destructive/50",
        outline: "text-secondary-foreground border-border hover:bg-muted",
        leftBordered:
          "border-l-8 border-primary rounded-l-0 text-secondary-foreground hover:bg-primary/30",
        invisible:
          "border-transparent bg-transparent text-secondary-foreground",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 pt-1.5 pb-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={ny(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
