import { Loader2 } from "lucide-react";
interface LoadingButtonProps {
  textColor?: string;
  bgColor?: string;
}

const LoadingButton = ({ textColor, bgColor }: LoadingButtonProps) => {
  return (
    <div
      className={`${bgColor} flex items-center justify-center gap-2 py-4 rounded opacity-60`}
    >
      <Loader2 className={`animate-spin ${textColor} h-7 w-7 `} />
    </div>
  );
};

export default LoadingButton;
