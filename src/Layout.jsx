import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Header />

      <Outlet />   {/* Only this part changes */}

      <Footer />
    </>
  );  
}

export default Layout;