import Appbar from "@/app/(site)/_components/Appbar";
import { ThemeProvider } from "next-themes";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full bg-red-500">
      <Appbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
