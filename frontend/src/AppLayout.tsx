import { AppShell, Burger, Box, Group, Stack, Avatar } from "@mantine/core";
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
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import "./App.css";
import classes from "./App.module.css";
import type { NavItem } from "./types";

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
          icon: HiDocumentText,
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
    { icon: HiQuestionMarkCircle, label: "Help", path: "/help" },
  ];

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
      <AppShell.Header bdrs="sm">
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
            <Sidebar mainNav={navigations} supNav={supNavigation} />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main className={classes.appMain}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;
