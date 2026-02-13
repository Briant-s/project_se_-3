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

function App() {
  const [navActive, setNavActive] = useState(0);
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
    { icon: HiChartPie, label: "Dashboard" },
    { icon: HiDocument, label: "Financial Readiness" },
    { icon: HiHeart, label: "Financial Health" },
    { icon: HiChartBar, label: "Financial Advisory" },
  ];

  const supNavigation = [
    { icon: HiCog, label: "Settings" },
    { icon: HiQuestionMarkCircle, label: "Help" },
  ];

  const mainLinks = mainNavigation.map((nav, index) => (
    <NavLink
      className={classes.navLink}
      bdrs={5}
      href="#test"
      key={nav.label}
      active={index === navActive}
      label={nav.label}
      leftSection={<nav.icon size={16} />}
      onClick={() => setNavActive(index)}
    />
  ));

  const supLinks = supNavigation.map((nav) => (
    <NavLink
      className={classes.navLink}
      bdrs={5}
      href="#test"
      key={nav.label}
      label={nav.label}
      leftSection={<nav.icon size={16} />}
    />
  ));

  return (
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
          <Stack justify="space-between" h="100%">
            {/* Nav Links */}
            <Stack gap="xs">
              <Box>General</Box>
              <Box>{mainLinks}</Box>
            </Stack>
            {/* Footer Sections */}
            <Stack>
              {/* Support Links */}
              <Box>{supLinks}</Box>
              <Box px={10} h={2} bg="gray.7"></Box>
              {/* User Account */}
              <Group>
                <Avatar color="violet" radius="xl">
                  LS
                </Avatar>
                <Box fz={12}>lorem.ipsum@gmail.com</Box>
              </Group>
            </Stack>
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
          <h1>Comparison</h1>Main Content is located here
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
