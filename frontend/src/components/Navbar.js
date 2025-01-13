import { getUserFromToken } from '../utils/auth';

const Navbar = () => {
  const user = getUserFromToken();

  return (
    <nav>
      <a href="/profile">Profile</a>
      {user?.role === 'admin' && <a href="/admin">Admin Panel</a>}
      <a href="/logout">Logout</a>
    </nav>
  );
};

export default Navbar;
