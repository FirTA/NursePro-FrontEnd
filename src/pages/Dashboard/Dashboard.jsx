
import useAuth from "../../hooks/useAuth";
import NurseDashboard from "./NurseDashboard";
import ManagementDashboard from "./ManagementDashboard";

// Role-based Dashboard component that shows the appropriate dashboard
const Dashboard = () => {
    const { auth } = useAuth();
    const userRole = auth?.user?.role?.toLowerCase() || auth?.role?.toLowerCase() || '';
    
    // Show the appropriate dashboard based on user role
    if (userRole === 'nurse') {
      return <NurseDashboard />;
    } else if (userRole === 'management' || userRole === 'admin') {
      return <ManagementDashboard />;
    }
    
    // Fallback for unknown roles
    return (
      <div>
        Unknown role. Please contact system administrator.
      </div>
    );
  };

export default Dashboard;