import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
interface IProps {
  status?: number;
  title?: string;
  children?: ReactNode;
}
const ErrorHandler = ({
  status = 500,
  title = "❌ Server Error",
  children,
}: IProps) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-[#000] flex flex-col items-center gap-2 justify-center z-50">
      <h1 className="font-extrabold text-[150px] text-white">{status}</h1>
      <h2 className="font-bold text-white">{title}</h2>
      {children ?? <Button onClick={() => navigate("/")}>Back To Home</Button>}
    </div>
  );
};

export default ErrorHandler;
