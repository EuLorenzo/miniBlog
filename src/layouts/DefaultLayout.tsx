import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <>
      <div>Navbar</div>
      <Outlet />
    </>
  );
};

export default DefaultLayout;
