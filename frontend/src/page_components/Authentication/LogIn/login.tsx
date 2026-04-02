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
import classes from "./Login.module.css";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

function LoginPage() {
  const imageLink =
    "https://images.unsplash.com/photo-1774387981914-c5a133e7380b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className={classes.wrapper}>
      <div className={classes.formPanel}>
        <Paper p={10} radius="md" className={classes.form}>
          <Title ta="center" fw={900} size="xl">
            Selamat Datang!
          </Title>
          <Text c="dimmed" size="md" ta="center" mt={5} mb={30}>
            Belum punya akun?{" "}
            <Anchor size="sm" component={Link} to="/registration">
              Daftar sekarang
            </Anchor>
          </Text>
          <Stack gap="md">
            <TextInput label="Email" placeholder="nama@email.com" required />
            <PasswordInput
              label="Password"
              placeholder="Masukkan password Anda"
              required
            />

            <Group justify="space-between" mt="xs">
              <Checkbox label="Ingat saya" />
              <Anchor component="button" size="sm">
                Lupa password?
              </Anchor>
            </Group>

            <Button fullWidth mt="md" radius="md">
              Masuk
            </Button>

            <Divider label="OR" labelPosition="center" my="sm" />

            <Button
              variant="default"
              bg="white"
              leftSection={<FcGoogle size={14} />}
            >
              Continue with Google
            </Button>
          </Stack>
        </Paper>
      </div>
      <Image className={classes.imagePanel} visibleFrom="md" src={imageLink} />
    </div>
  );
}

export default LoginPage;
