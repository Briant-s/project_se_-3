import { Button, ScrollArea, Stack } from "@mantine/core";
import type { NavItem } from "../types";
import { NavLinkGroup } from "../lib";
import { brandColors } from "../gradients";

interface Props {
  mainNav: NavItem[];
}

function Sidebar({ mainNav }: Props) {
  return (
    <Stack justify="space-between" h="calc(100vh - 80px)" gap="md">
      <Stack gap="sm" style={{ flex: 1, overflow: "hidden", }}>
        <Button 
        style={{
          background: brandColors.primaryButton
        }}
        fullWidth>Fill Out Business Quiz</Button>

        <ScrollArea scrollbars="y" flex={1}>
          <Stack gap={4}>
            {mainNav.map((item) => (
              <NavLinkGroup key={item.label} link={item} />
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </Stack>
  );
}
export default Sidebar;
