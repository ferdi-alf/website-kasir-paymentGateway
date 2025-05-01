"use client";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { useEffect, useState } from "react";
import Menu from "@/components/adminDashboard/Menu";
import ConfirmTable from "@/components/table/TableConfirmPesanan";
import HistoryPesanan from "@/components/userDashboard/HistoryPesanan";
import UserMenu from "@/components/adminDashboard/UserTable";

const Dashboard = () => {
  const [value, setValue] = useState("1");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessionData() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/session");

        if (response.ok) {
          const sessionData = await response.json();
          if (sessionData && sessionData.user && sessionData.user.role) {
            setUserRole(sessionData.user.role);
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessionData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="w-full h-screen md:p-0 p-2  flex justify-center items-start mt-10">
      <div className="md:w-5/6 w-full  bg-white shadow-xl rounded-lg p-5">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                textColor="inherit"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "green",
                  },

                  "& .Mui-selected": {
                    color: "green",
                  },
                }}
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Pesanan" value="1" />
                <Tab label="Product Menu" value="2" />
                <Tab label="History Penjualan" value="3" />
                {userRole === "ADMIN" && <Tab label="User" value="4" />}
              </TabList>
            </Box>
            <TabPanel value="1">
              <ConfirmTable />
            </TabPanel>
            <TabPanel value="2">
              <Menu />
            </TabPanel>
            <TabPanel value="3">
              <HistoryPesanan />
            </TabPanel>
            {userRole === "ADMIN" && (
              <TabPanel value="4">
                <UserMenu />
              </TabPanel>
            )}
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
