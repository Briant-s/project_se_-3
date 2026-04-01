// import { Children, useState } from "react";
import {
  AppShell,
  Burger,
  Box,
  createTheme,
  Group,
  MantineProvider,
  Stack,
  Avatar
} from "@mantine/core";
import {
  HiBriefcase,
  HiClipboard,
  HiChartPie,
  HiCog,
  HiQuestionMarkCircle,
  HiCalculator,
  HiBanknotes,
  HiClipboardDocumentCheck,
  HiDocumentCurrencyDollar,
  HiDocumentText,
  HiIdentification,
  HiClipboardDocumentList,
  HiDocumentDuplicate
} from "react-icons/hi2";
import { useDisclosure } from "@mantine/hooks";
import "./App.css";
import classes from "./App.module.css";
// import { Label } from "recharts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import {
  Dashboard,
  FinancialAdvisory,
  FinancialHealth,
  FinancialReadiness,
  Help,
  Settings,
  BusinessProfile,
  ProfileQuiz,
  FinancialOverview,
  LoginPage
} from "./page_components";
import {
  Elig_Overview,
  LoanCalculatorPage,
  CashBufferPage,
  QuizPage,
} from "./eligibility";
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
    { icon: HiChartPie, label: "Overview", path: "" },
    {
      icon: HiBriefcase,
      label: "My Business",
      path: "my-business",
      children: [
        {
          icon: HiIdentification,
          label: "Business Overview",
          path: "business-profile",
        },
        {
          icon: HiBanknotes,
          label: "Financial Overview",
          path: "financial-overview",
        },
        {
          icon: HiClipboard,
          label: "Profile Quiz",
          path: "profile-quiz",
        },
      ],
    },
    {
      icon: HiClipboardDocumentCheck,
      label: "Eligibility Check",
      path: "eligibility-check",
      children: [
        {
          icon: HiChartPie,
          label: "Eligibility Overview",
          path: "eligibility-overview",
        },
        {
          icon: HiClipboard,
          label: "Eligibility Quiz",
          path: "eligibility-quiz",
        },
        {
          icon: HiCalculator,
          label: "Loan Calculator",
          path: "loan-calculator",
        },
        {
          icon: HiCalculator,
          label: "Cash Buffer Calculator",
          path: "cash-buffer-calculator",
        },
      ],
    },
    {
      icon: HiDocumentDuplicate,
      label: "Document Prep",
      path: "document-prep",
      children: [
        {
          icon: HiDocumentText,
          label: "Document Overview",
          path: "document-overview",
        },
        {
          icon: HiDocumentCurrencyDollar,
          label: "Financial Documents",
          path: "financial-documents",
        },
        {
          icon: HiDocumentText
          ,
          label: "Legal Documents",
          path: "legal-documents",
        },
      ],
    },
    {
      icon: HiClipboardDocumentList,
      label: "Business Proposal",
      path: "business-proposal",
    },
  ];

  const supNavigation: NavItem[] = [
    { icon: HiCog, label: "Settings", path: "/settings" },
    { icon: HiQuestionMarkCircle, label: "Help", path: "/help" }
  ];

  return (
    <BrowserRouter>
      <MantineProvider theme={mainTheme}>
        <AppShell
          style={{ minWidth: 0, minHeight: 0 }}
          padding="sm"
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !mobOpened, desktop: !deksOpened },
          }}
        >
          <AppShell.Header bdrs="sm">
            <Group h="100%" px="md" justify="space-between">
              <Group>
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
              <Group>
                <Avatar color="violet" radius="xl">
                  LS
                </Avatar>
                <Box fz={12}>lorem.ipsum@gmail.com</Box>
              </Group>
            </Group>
          </AppShell.Header>
          
          <AppShell.Navbar
            p="xs"
            bg="gray.0"
            style={{ borderRight: "1px solid #e9ecef" }}
          >

            <AppShell.Section grow px="xs">
              <Stack gap={4}>
                {" "}
                <Sidebar mainNav={navigations} supNav={supNavigation} />
              </Stack>
            </AppShell.Section>

          </AppShell.Navbar>

          <AppShell.Main className={classes.appMain}>
            <Routes>
              <Route path="/" element={<Dashboard />}></Route>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/" element={<Dashboard />}></Route>
              <Route
                path="/my-business/business-profile"
                element={<BusinessProfile />}
              />
              <Route
                path="/my-business/business-profile"
                
                element={<BusinessProfile />}
              />
              <Route
                path="/my-business/financial-overview"
                element={<FinancialOverview />}
              />
              <Route
                path="/my-business/profile-quiz"
                element={<ProfileQuiz/>}
              />
              <Route
                path="/eligibility-check/eligibility-overview"
                element={<Elig_Overview />}
              />
              <Route
                path="/eligibility-check/eligibility-quiz"
                element={<QuizPage />}
              />
              <Route
                path="/eligibility-check/loan-calculator"
                element={<LoanCalculatorPage />}
              />
              <Route
                path="/eligibility-check/cash-buffer-calculator"
                element={<CashBufferPage />}
              />
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
