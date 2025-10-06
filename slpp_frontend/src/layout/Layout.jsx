import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-5 bg-gray-100 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
