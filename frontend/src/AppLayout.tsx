import {
  AppShell,
  Burger,
  Box,
  Group,
  Stack,
  Avatar,
  Button,
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
  HiDocumentDuplicate,
} from "react-icons/hi2";

import { dummyProposals } from "./page_components/Business_Proposal_List";

import { useDisclosure } from "@mantine/hooks";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import { UserProfile } from "./components";
import "./App.css";
import classes from "./App.module.css";
import type { NavItem } from "./types";
import { UserAuth } from "./context/AuthContext";

function AppLayout() {
  const [mobOpened, { toggle: toggleMob }] = useDisclosure();
  const [deksOpened, { toggle: toggleDeks }] = useDisclosure(true);

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
      path: "credit",
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
          path: "amort-calc",
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
          icon: HiDocumentText,
          label: "Legal Documents",
          path: "legal-documents",
        },
      ],
    },
    {
      icon: HiClipboardDocumentList,
      label: "Business Proposal",
      path:
        dummyProposals.length > 0
          ? "business-proposal/list"
          : "business-proposal",
    },
  ];

  const { session, signOutUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
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
      <AppShell.Header
        bdrs="sm"
        // bg="#D2E5E8"
        style={{
          background: "rgba(210, 229, 232, 0.4)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(210, 214, 218, 0.13)",
          // position: "relative",
          zIndex: 1,
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={mobOpened}
              onClick={toggleMob}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={deksOpened}
              onClick={toggleDeks}
              visibleFrom="sm"
              size="sm"
            />
            PoestaKas
          </Group>

          <UserProfile
            user_email={session?.user?.email}
            handleSignOut={handleSignOut}
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="xs"
        bg="#f4f5f6"
        style={{ borderRight: "1px solid #e9ecef" }}
      >
        <AppShell.Section grow px="xs">
          <Stack gap={4}>
            <Sidebar mainNav={navigations} />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main className={classes.appMain} bg="#f5f5f5">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;
