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
import { HiCake, HiCheckCircle } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useForm } from "@mantine/form";

function RegistrationPage() {
  const imageLink =
    "https://images.unsplash.com/photo-1774387981914-c5a133e7380b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordlen, setIsPassowrdlen] = useState(true);

  const navigate = useNavigate();

  const { session, signUpUser } = UserAuth();
  console.log(session);

  const handleSignUp = async (values) => {
    setLoading(true);
    // console.log(values);

    try {
      const result = await signUpUser(
        values.name,
        values.email,
        values.password,
      );
      if (result.success) {
        navigate("/");
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
      name: "",
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
            Registration
          </Title>

          <Stack gap="md">
            <form onSubmit={form.onSubmit(handleSignUp)}>
              <Stack>
                <TextInput
                  {...form.getInputProps("name")}
                  label="Name"
                  placeholder=""
                  required
                />
                <TextInput
                  {...form.getInputProps("email")}
                  label="Email"
                  placeholder="nama@email.com"
                  required
                />
                <PasswordInput
                  {...form.getInputProps("password")}
                  label="Password"
                  placeholder=""
                  required
                />
                <Stack>
                  <Text c="dimmed" size="xs">
                    Password must include:
                  </Text>
                  <Group align="center">
                    {isPasswordlen ? (
                      <>
                        <HiCheckCircle color="green" />
                      </>
                    ) : (
                      <>
                        <HiCheckCircle color="red" />
                      </>
                    )}
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

              <Button type="submit" fullWidth mt="md" radius="md">
                Daftar
              </Button>
            </form>

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
