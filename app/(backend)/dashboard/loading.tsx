import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-150px)]">
      <Loader2 className="animate-spin" size={45} />
    </div>
  );
};

export default loading;
