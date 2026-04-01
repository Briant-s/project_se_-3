import {
  Container,
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
} from "@mantine/core";

function LoginPage() {
  return (
    <Container size={420} my={50}>
      <Title ta="center" fw={900}>
        Selamat Datang!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
        Belum punya akun?{" "}
        <Anchor size="sm" component="button">
          Daftar sekarang
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="nama@email.com"
            required
          />
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
        </Stack>
      </Paper>
    </Container>
  );
}

export default LoginPage;