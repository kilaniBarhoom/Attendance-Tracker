import { useAuth } from "@/providers/auth-provider";

type AuthorizedRenderProps = {
  children: React.ReactNode;
  authorizedRoles: string[];
  replacement?: React.ReactNode;
};

const AuthorizedRender = ({
  children,
  authorizedRoles,
  replacement,
}: AuthorizedRenderProps) => {
  const { user } = useAuth();
  const userRole = user?.role ?? "user";
  return authorizedRoles.includes(userRole) ? children : replacement ?? null;
};

export default AuthorizedRender;
