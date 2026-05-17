import { Avatar, Button, Group, Menu, Stack, Text } from "@mantine/core";

import {
  HiLogout,
  HiQuestionMarkCircle,
  HiOutlineUser,
  HiCog,
  HiChevronDown,
} from "react-icons/hi";

interface Props {
  user_email: string | undefined | null;
  business_name?: string | null;
  handleSignOut: (e: any) => Promise<void>;
}

function UserProfile({ user_email, handleSignOut }: Props) {
  return (
    <>
      <Menu width="target">
        <Menu.Target>
          <Button h="auto" p={5} size="sm" variant="subtle">
            <Group w="100%">
              <Avatar size="sm" src={null}></Avatar>
              <Stack gap="0.1rem" flex={1}>
                <Text size="xs" ta="left">
                  {user_email}
                </Text>
                <Text size="xs" c="dimmed" ta="left">
                  Business Name
                </Text>
              </Stack>
              <HiChevronDown size={12} />
            </Group>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<HiOutlineUser />}>Profile</Menu.Item>
          <Menu.Item leftSection={<HiCog />}>Settings</Menu.Item>
          <Menu.Item leftSection={<HiQuestionMarkCircle />}>Help</Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<HiLogout />}
            c="red.5"
            onClick={handleSignOut}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

export default UserProfile;
