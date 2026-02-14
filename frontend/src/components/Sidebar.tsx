import { Avatar, Box, Group, NavLink, Stack } from "@mantine/core";
import type { IconType } from "react-icons";
import classes from "../App.module.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  mainNav: {
    icon: IconType;
    label: string;
    path: string;
  }[];
  supNav: {
    icon: IconType;
    label: string;
    path: string;
  }[];
}

function Sidebar({ mainNav, supNav }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const mainLinks = mainNav.map((nav) => (
    <NavLink
      className={classes.navLink}
      bdrs={5}
      key={nav.label}
      active={location.pathname === nav.path}
      label={nav.label}
      leftSection={<nav.icon size={16} />}
      onClick={() => {
        navigate(nav.path);
      }}
    />
  ));

  const supLinks = supNav.map((nav) => (
    <NavLink
      className={classes.navLink}
      bdrs={5}
      key={nav.label}
      active={location.pathname === nav.path}
      label={nav.label}
      leftSection={<nav.icon size={16} />}
      onClick={() => {
        navigate(nav.path);
      }}
    />
  ));

  return (
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
  );
}

export default Sidebar;
