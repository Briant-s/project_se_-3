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
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../../context/AuthContext";
import { useForm } from "@mantine/form";
import { useState } from "react";

function LoginPage() {
  const imageLink =
    "https://images.unsplash.com/photo-1774387981914-c5a133e7380b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { session, signInUser } = UserAuth();

  const handleSignIn = async (values) => {
    setLoading(true);
    console.log(values);

    try {
      const result = await signInUser(values.email, values.password);
      if (result.success) {
        navigate("/my-business/business-profile");
      }
    } catch (err) {
      setError("an error occured");
    } finally {
      setLoading(false);
    }
  };

  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (value.includes("@") ? null : "Invalid Email"),
    },
  });

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
          <form onSubmit={form.onSubmit(handleSignIn)}>
            <Stack>
              <TextInput
                {...form.getInputProps("email")}
                label="Email"
                placeholder="nama@email.com"
                required
              />
              <PasswordInput
                {...form.getInputProps("password")}
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

              <Button type="submit" fullWidth mt="md" radius="md">
                Masuk
              </Button>
            </Stack>
          </form>
          <Stack gap="md">
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
