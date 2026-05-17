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
  BusinessProposal,
  BusinessProposalResult,
  BusinessProposalList,
  AIBusinessProposalResult,
} from "./page_components";
import {
  Elig_Overview,
  QuizPage,
} from "./eligibility";
import AppLayout from "./AppLayout";
import PrivateRouter from "./PrivateRouter";
import { ModalsProvider } from "@mantine/modals";
import Amort_Details from "./page_components/Credit/Amort_Details";

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
                  path="/credit/amort-calc/:id"
                  element={<Amort_Details />}
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
                <Route path="/business-proposal" element={<BusinessProposal />} />
                <Route path="/business-proposal/edit/:proposalID" element={<BusinessProposal />} />
                <Route path="/business-proposal/list" element={<BusinessProposalList />} />
                <Route path="/business-proposal/result/:id" element={<BusinessProposalResult />} />
                <Route path="/ai-business-proposal/result/:id" element={<AIBusinessProposalResult />} />
              </Route>
            </Route>
          </Routes>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
