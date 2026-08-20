import { Navigate } from 'react-router-dom';
import EmployeeDashboard from '../dashboard/EmployeeDashboard';
import { useAuth } from '../context/useAuth';
import Navbar from './Navbar';
import StockManagerDashBoard from '../dashboard/StockManagerDashboard';
import ManagerDashboard from '../dashboard/ManagerDashboard';
import AssetIssuerDashBoard from '../dashboard/AssetIssuerDashboard';
import AdminDashboard from "../dashboard/AdminDashboard";

const DASHBOARDS = {
  EMPLOYEE: EmployeeDashboard,
  MANAGER: ManagerDashboard,
  STOCK_MANAGER: StockManagerDashBoard,
  ASSET_ISSUER: AssetIssuerDashBoard,
  ADMIN: AdminDashboard
};

function DashboardRoute() {
  const { isLoading, role } = useAuth();
  const Dashboard = DASHBOARDS[role];

  if (isLoading) {
    return null;
  }

  if (!Dashboard) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Dashboard />
    </>
  );
}

export default DashboardRoute;
