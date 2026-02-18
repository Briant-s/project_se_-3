import { Children, useState } from "react";
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
  HiBriefcase,
  HiChartBar,
  HiClipboardCheck,
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
import type { NavItem } from "./types";

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

  const navigations: NavItem[] = [
    { icon: HiChartPie, label: "Overview", path: "/" },
    {
      icon: HiBriefcase,
      label: "Business Profile",
      path: "/business-profile",
    },
    {
      icon: HiClipboardCheck,
      label: "Eligibility Check",
      path: "eligibility-check",
      children: [
        {
          icon: HiChartPie,
          label: "Eligibility Overview",
          path: "eligibility-overview",
        },
        {
          icon: HiChartPie,
          label: "Eligibility Quiz",
          path: "eligibility-quiz",
        },
        {
          icon: HiDocument,
          label: "Loan Calculator",
          path: "loan-calculator",
        },
        {
          icon: HiHeart,
          label: "Cash Buffer Calculator",
          path: "cash-buffer-calculator",
        },
      ],
    },
    {
      icon: HiDocument,
      label: "Document Prep",
      path: "document-prep",
      children: [
        {
          icon: HiDocument,
          label: "Document Overview",
          path: "document-overview",
        },
        {
          icon: HiDocument,
          label: "Financial Documents",
          path: "financial-documents",
        },
        {
          icon: HiDocument,
          label: "Legal Documents",
          path: "legal-documents",
        },
      ],
    },
    {
      icon: HiDocument,
      label: "Business Proposal",
      path: "/business-proposal",
    },
  ];

  const supNavigation: NavItem[] = [
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
            <Sidebar mainNav={navigations} supNav={supNavigation} />
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
