import { useState } from "react";
import {
  AppShell,
  Burger,
  Box,
  createTheme,
  Group,
  MantineProvider,
  NavLink,
  Stack,
  Avatar,
  Text,
} from "@mantine/core";
import {
  HiChartBar,
  HiDocument,
  HiHeart,
  HiChartPie,
  HiCog,
  HiQuestionMarkCircle,
} from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import classes from "./App.module.css";
import { Label } from "recharts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import {
  Dashboard,
  FinancialAdvisory,
  FinancialHealth,
  FinancialReadiness,
  Help,
  Settings,
} from "./page_components";

function App() {
  const [mobOpened, { toggle: toggleMob }] = useDisclosure();
  const [deksOpened, { toggle: toggleDeks }] = useDisclosure(true);
  const mainTheme = createTheme({
    fontFamily: "Swansea",
    primaryColor: "blue",
    headings: {
      fontFamily: "Swansea",
      sizes: {
        h1: { fontSize: "20px" },
      },
    },
  });

  const mainNavigation = [
    { icon: HiChartPie, label: "Dashboard", path: "/" },
    {
      icon: HiDocument,
      label: "Financial Readiness",
      path: "/financial-readiness",
    },
    { icon: HiHeart, label: "Financial Health", path: "/financial-health" },
    {
      icon: HiChartBar,
      label: "Financial Advisory",
      path: "/financial-advisory",
    },
  ];

  const supNavigation = [
    { icon: HiCog, label: "Settings", path: "/settings" },
    { icon: HiQuestionMarkCircle, label: "Help", path: "/help" },
  ];

  return (
    <BrowserRouter>
      <MantineProvider theme={mainTheme}>
        <AppShell
          padding="sm"
          lts={"0.05em"}
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !mobOpened, desktop: !deksOpened },
          }}
        >
          <AppShell.Header bdrs="sm">
            <Group h="100%" px="md">
              <Burger
                opened={mobOpened}
                onClick={toggleMob}
                hiddenFrom="sm"
                size="sm"
              ></Burger>
              <Burger
                opened={deksOpened}
                onClick={toggleDeks}
                visibleFrom="sm"
                size="sm"
              ></Burger>
              PoestaKas
            </Group>
          </AppShell.Header>
          <AppShell.Navbar
            ta="left"
            py="xl"
            px="md"
            bg="gray.1"
            bdrs="md"
            c="gray.8"
          >
            <Sidebar mainNav={mainNavigation} supNav={supNavigation} />
          </AppShell.Navbar>
          <AppShell.Main className={classes.appMain}>
            <Routes>
              <Route path="/" element={<Dashboard />}></Route>
              <Route
                path="/financial-readiness"
                element={<FinancialReadiness />}
              ></Route>
              <Route
                path="/financial-health"
                element={<FinancialHealth />}
              ></Route>
              <Route
                path="/financial-advisory"
                element={<FinancialAdvisory />}
              ></Route>
              <Route path="/settings" element={<Settings />}></Route>
              <Route path="/help" element={<Help />}></Route>
            </Routes>
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
