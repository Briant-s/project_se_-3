import {
  Avatar,
  Box,
  Button,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import type { IconType } from "react-icons";
import classes from "../App.module.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { NavItem } from "../types";
import { NavLinkGroup } from "../lib";

interface Props {
  mainNav: NavItem[];
  supNav: NavItem[];
}

function Sidebar({ mainNav, supNav }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

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
    <Stack justify="space-between" h="calc(100vh - 80px)" gap="md">
      
      <Stack gap="sm" style={{ flex: 1, overflow: 'hidden' }}>
        <Button fullWidth>Fill Out Business Quiz</Button>
        
        <ScrollArea scrollbars="y" flex={1}>
          <Stack gap={4}>
            {mainNav.map((item) => (
              <NavLinkGroup key={item.label} link={item} />
            ))}
          </Stack>
        </ScrollArea>
      </Stack>

      <Stack gap="xs" pb="md">
        <Box>{supLinks}</Box>
        <Box px={10} h={1} bg="gray.3"></Box>
      </Stack>
    </Stack>
  );
}
export default Sidebar;
