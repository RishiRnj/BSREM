import { AuthProvider } from "./Context/AuthContext";
import { LoadingProvider } from "./Context/LoadingContext";

const AppProviders = ({ children }) => (
  <AuthProvider>
    <LoadingProvider>
      {children}
    </LoadingProvider>
  </AuthProvider>
);

export default AppProviders;
