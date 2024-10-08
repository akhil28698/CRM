import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import CRMProvider from './store/CRM_store.jsx';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AdminLogin from './admin/AdminLogin.jsx';
import CustomerLogin from './customer/CustomerLogin.jsx';
import EmployeeLogin from './employee/EmployeeLogin.jsx';
import CustomerDashboard from './customer/CustomerDashboard.jsx';
import EmployeeDashboard from './employee/EmployeeDashboard.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import "bootstrap/dist/css/bootstrap.min.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/customer",
    element: <CustomerLogin />,
  },
  {
    path: "/customer/dashboard",
    element: <CustomerDashboard />

  },
  {
    path: "/employee",
    element: <EmployeeLogin />,
  },
  {
    path: "/employee/dashboard",
    element: <EmployeeDashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <CRMProvider>
    <RouterProvider router={router} />
  </CRMProvider>
)
