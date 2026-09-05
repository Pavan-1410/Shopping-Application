import { useNavigate } from "react-router-dom";
import { User, ShieldCheck, ArrowRight } from "lucide-react";

const SelectRole = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: "user" | "admin") => {
    localStorage.setItem("selectedRole", role);
    navigate("/login");
  };

  return (
<div className="min-h-screen bg-linear-to-br from-blue-600 via-blue-500 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="text-center px-6 pt-10 pb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-400 mb-5 shadow-lg">
              <span className="text-3xl font-bold text-blue-700">
                S
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Welcome!
            </h1>

            <p className="mt-3 text-gray-500 text-base sm:text-lg">
              Please select your role to continue
            </p>
          </div>

          {/* Role Cards */}
          <div className="px-6 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* User Card */}
              <button
                onClick={() => handleRoleSelect("user")}
                className="group text-left border-2 border-gray-100 rounded-2xl p-7 sm:p-8
                hover:border-blue-500 hover:shadow-xl
                transition-all duration-300
                hover:-translate-y-1
                focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <div className="flex items-center gap-6">
                  
                  {/* Icon */}
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-blue-100
                    flex items-center justify-center
                    group-hover:bg-blue-600 transition-colors duration-300"
                  >
                    <User
                      size={32}
                      className="text-blue-600 group-hover:text-white transition-colors duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      User
                    </h2>

                    <p className="mt-1 text-gray-500">
                      Shop products and manage your orders.
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    size={24}
                    className="shrink-0 text-gray-300
                    group-hover:text-blue-600
                    group-hover:translate-x-1
                    transition-all duration-300"
                  />
                </div>
              </button>

              {/* Admin Card */}
              <button
                onClick={() => handleRoleSelect("admin")}
                className="group text-left border-2 border-gray-100 rounded-2xl p-7 sm:p-8
                hover:border-yellow-400 hover:shadow-xl
                transition-all duration-300
                hover:-translate-y-1
                focus:outline-none focus:ring-4 focus:ring-yellow-100"
              >
                <div className="flex items-center gap-6">
                  
                  {/* Icon */}
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-yellow-100
                    flex items-center justify-center
                    group-hover:bg-yellow-400 transition-colors duration-300"
                  >
                    <ShieldCheck
                      size={32}
                      className="text-yellow-600 group-hover:text-blue-800 transition-colors duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Admin
                    </h2>

                    <p className="mt-1 text-gray-500">
                      Manage products, orders and users.
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    size={24}
                    className="shrink-0 text-gray-300
                    group-hover:text-yellow-500
                    group-hover:translate-x-1
                    transition-all duration-300"
                  />
                </div>
              </button>

            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-100 px-6 py-5 text-center">
            <p className="text-sm text-gray-500">
              Choose the role you want to continue as.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SelectRole;