import { AuthProvider } from "./Context/AuthContext";
const AppProviders = ({ children }) => (
  <AuthProvider>
    
      {children}
    
  </AuthProvider>
);

export default AppProviders;
