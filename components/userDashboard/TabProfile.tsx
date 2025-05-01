"use client";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import OrderTable from "../table/TablePesanan";
import HistoryPesanan from "./HistoryPesanan";
import MenuFavorit from "./MenuFavorit";

const TabProfile = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="md:w-4/6 w-full mt-12 md:mt-0 bg-white rounded-lg shadow-lg">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "green",
                },
                "& .MuiTab-root": {
                  color: "black",
                },
                "& .Mui-selected": {
                  color: "green",
                },
              }}
              onChange={handleChange}
            >
              <Tab label="Pesanan Anda" value="1" />
              <Tab label="History Pesanan" value="2" />
              <Tab label="Menu Favorit" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <OrderTable />
          </TabPanel>
          <TabPanel value="2">
            <HistoryPesanan />
          </TabPanel>
          <TabPanel value="3">
            <MenuFavorit />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default TabProfile;
