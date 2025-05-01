import Profile from "@/components/userDashboard/Profile";
import TabProfile from "@/components/userDashboard/TabProfile";

const DashboardUser = async () => {
  return (
    <div className="w-full  flex justify-center">
      <div className="rounded-lg flex flex-col md:flex-row  justify-between  w-11/12 mt-10 md:w-10/12">
        <Profile />
        <TabProfile />
      </div>
    </div>
  );
};

export default DashboardUser;
