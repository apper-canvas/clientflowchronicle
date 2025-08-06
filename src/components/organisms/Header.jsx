import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '@/App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ title, children, onMobileMenuToggle }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button and title */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onMobileMenuToggle}
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">
              {title}
            </h1>
          </div>

          {/* Center - Custom content */}
          <div className="flex-1 flex justify-center px-4">
            {children}
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.emailAddress}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="LogOut" className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;