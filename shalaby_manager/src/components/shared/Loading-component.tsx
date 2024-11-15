import { ny } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const LoadingComponent = ({
  size = 10,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className={ny(
        "flex items-center justify-center h-full w-full",
        className
      )}
    >
      <Loader2 size={size} className="text-primary animate-spin" />
    </div>
  );
};

export default LoadingComponent;
