import { Loader2 } from "lucide-react";
interface LoadingButtonProps {
  textColor?: string;
  bgColor?: string;
  className?: string;
}

const LoadingButton = ({
  textColor,
  bgColor,
  className,
}: LoadingButtonProps) => {
  return (
    <div
      className={`${bgColor} flex items-center justify-center gap-2 py-2 rounded opacity-60 ${className}`}
    >
      <Loader2 className={`animate-spin ${textColor} h-7 w-7 `} />
    </div>
  );
};

export default LoadingButton;
