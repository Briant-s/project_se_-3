// import { Children, useState } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import "./App.css";
// import { Label } from "recharts";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  LoginPage,
  RegistrationPage,
  AmortCalcPage,
} from "./page_components";
import {
  Elig_Overview,
  LoanCalculatorPage,
  CashBufferPage,
  QuizPage,
} from "./eligibility";
import AppLayout from "./AppLayout";
import PrivateRouter from "./PrivateRouter";
import { ModalsProvider } from "@mantine/modals";

function App() {
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

  return (
    <BrowserRouter>
      <MantineProvider theme={mainTheme}>
        <ModalsProvider>
          <Routes>
            {/* Standalone - no shell */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />

            {/* Shell-wrapped routes */}
            <Route element={<PrivateRouter />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
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
                  element={<ProfileQuiz />}
                />
                <Route
                  path="/credit/eligibility-overview"
                  element={<Elig_Overview />}
                />
                <Route path="/credit/eligibility-quiz" element={<QuizPage />} />
                <Route path="/credit/amort-calc" element={<AmortCalcPage />} />
                <Route
                  path="/credit/cash-buffer-calculator"
                  element={<CashBufferPage />}
                />
                <Route
                  path="/financial-readiness"
                  element={<FinancialReadiness />}
                />
                <Route path="/financial-health" element={<FinancialHealth />} />
                <Route
                  path="/financial-advisory"
                  element={<FinancialAdvisory />}
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
              </Route>
            </Route>
          </Routes>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
