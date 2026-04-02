import {
  Divider,
  Paper,
  Stack,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Group,
  Anchor,
  Checkbox,
  Image,
} from "@mantine/core";
import classes from "./Regis.module.css";
import { HiCheckCircle } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

function RegistrationPage() {
  const imageLink =
    "https://images.unsplash.com/photo-1774387981914-c5a133e7380b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className={classes.wrapper}>
      <div className={classes.formPanel}>
        <Paper p={10} radius="md" className={classes.form}>
          <Title ta="center" fw={900} size="xl">
            Registration
          </Title>

          <Stack gap="md">
            <Stack>
              <TextInput label="Name" placeholder="" required />
              <TextInput label="Email" placeholder="nama@email.com" required />
              <PasswordInput label="Password" placeholder="" required />
              <Stack>
                <Text c="dimmed" size="xs">
                  Password must include:
                </Text>
                <Group align="center">
                  <HiCheckCircle />
                  <Text size="xs">Must contain 1 number</Text>
                </Group>
                <Group align="center">
                  <HiCheckCircle />
                  <Text size="xs">Min 8 characthers</Text>
                </Group>
              </Stack>
            </Stack>

            <Group justify="space-between" mt="xs">
              <Checkbox label="Terms and Conditions" />
            </Group>

            <Button fullWidth mt="md" radius="md">
              Daftar
            </Button>

            <Text c="dimmed" size="md" ta="center">
              Sudah punya akun?{" "}
              <Anchor size="sm" component={Link} to="/login">
                Login sekarang
              </Anchor>
            </Text>

            <Divider label="OR" labelPosition="center" my="sm" />

            <Button
              variant="default"
              bg="white"
              leftSection={<FcGoogle size={14} />}
            >
              Sign Up with Google
            </Button>
          </Stack>
        </Paper>
      </div>
      <Image className={classes.imagePanel} visibleFrom="md" src={imageLink} />
    </div>
  );
}

export default RegistrationPage;
