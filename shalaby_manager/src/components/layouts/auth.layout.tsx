import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="min-h-screen p-4 w-full bg-gradient-to-br from-primary light:to-blue-500 dark:to-blue-900/30 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <main className="border rounded-md p-6 bg-background max-w-md mx-auto w-full">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
