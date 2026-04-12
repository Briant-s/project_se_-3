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
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Regis.module.css";
import { HiCake, HiCheckCircle } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../../context/AuthContext";
import { useState, useMemo } from "react";
import { useForm } from "@mantine/form";

// Fungsi validasi email yang komprehensif
const validateEmailFormat = (email: string) => {
  if (!email) {
    return { isValid: false, errors: [] };
  }

  const errors: string[] = [];

  // Check for @
  if (!email.includes("@")) {
    errors.push("Email harus mengandung simbol '@'");
  }

  // Check for .
  if (!email.includes(".")) {
    errors.push("Email harus mengandung titik '.'");
  }

  // Split by @
  const [localPart, domain] = email.split("@");

  if (email.includes("@") && domain) {
    // Check if . comes after @
    if (!domain.includes(".")) {
      errors.push("Domain harus mengandung titik '.' setelah '@'");
    }

    // Check domain format
    if (domain.includes(".")) {
      const domainParts = domain.split(".");
      if (domainParts.some((part) => part.length === 0)) {
        errors.push("Format domain tidak valid");
      }
      if (domainParts[domainParts.length - 1].length < 2) {
        errors.push("Ekstensi domain minimal 2 karakter (contoh: .com, .id)");
      }
    }
  }

  // Check local part (sebelum @)
  if (email.includes("@") && localPart) {
    if (localPart.length < 1) {
      errors.push("Bagian sebelum '@' tidak boleh kosong");
    }
    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      errors.push("Tidak boleh ada titik di awal atau akhir email");
    }
  }

  // Check for spaces
  if (email.includes(" ")) {
    errors.push("Email tidak boleh mengandung spasi");
  }

  // Basic regex check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email) && errors.length === 0;

  return { isValid, errors };
};

// Fungsi validasi password
const validatePassword = (password: string) => {
  const requirements = {
    hasNumber: /\d/.test(password),
    minLength: password.length >= 8,
  };

  return requirements;
};

function RegistrationPage() {
  const imageLink =
    "https://images.unsplash.com/photo-1774387981914-c5a133e7380b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordlen, setIsPassowrdlen] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const navigate = useNavigate();

  const { session, signUpUser } = UserAuth();
  console.log(session);

  // Hitung validasi email secara real-time
  const emailValidation = useMemo(() => {
    return validateEmailFormat(email);
  }, [email]);

  // Hitung validasi password secara real-time
  const passwordValidation = useMemo(() => {
    return validatePassword(password);
  }, [password]);

  const handleSignUp = async (values) => {
    // Validasi email sebelum submit
    const emailCheck = validateEmailFormat(values.email);
    if (!emailCheck.isValid) {
      setError("Email tidak valid. Mohon perbaiki format email.");
      open();
      return;
    }

    // Validasi password sebelum submit
    const passwordCheck = validatePassword(values.password);
    if (!passwordCheck.hasNumber || !passwordCheck.minLength) {
      setError("Password tidak memenuhi persyaratan.");
      open();
      return;
    }

    // Validasi terms and conditions sebelum submit
    if (!termsChecked) {
      setError("Anda harus menyetujui Terms and Conditions.");
      open();
      return;
    }

    setLoading(true);
    console.log("Attempting sign up...", values);

    try {
      const result = await signUpUser(
        values.name,
        values.email,
        values.password,
      );
      console.log("Sign up result:", result);
      if (result && result.success) {
        navigate("/");
      } else if (result && result.error) {
        // Extract error message dari Supabase error object
        const errorMessage = result.error.message || "Registration failed";
        setError(errorMessage);
        open();
      }
    } catch (err) {
      // Capture error message dari Supabase
      console.error("Sign up error:", err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred during registration";
      setError(errorMessage);
      open();
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
                <Stack gap={4}>
                  <TextInput
                    {...form.getInputProps("email")}
                    label="Email"
                    placeholder="nama@email.com"
                    required
                    onChange={(e) => {
                      setEmail(e.currentTarget.value);
                      form.setFieldValue("email", e.currentTarget.value);
                    }}
                    error={
                      email && emailValidation.errors.length > 0
                        ? true
                        : false
                    }
                  />
                  {/* Tampilkan validasi pesan */}
                  {email && emailValidation.errors.length > 0 && (
                    <Stack gap={6}>
                      {emailValidation.errors.map((err, idx) => (
                        <Group key={idx} align="flex-start" gap={8}>
                          <HiCheckCircle
                            color="red"
                            size={16}
                            style={{ marginTop: 2, flexShrink: 0 }}
                          />
                          <Text size="xs" c="red">
                            {err}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  )}
                  {/* Tampilkan pesan sukses jika email valid */}
                  {email && emailValidation.isValid && (
                    <Group align="center" gap={8}>
                      <HiCheckCircle color="green" size={16} />
                      <Text size="xs" c="green">
                        Email Valid
                        {/* Email valid ✓ */}
                      </Text>
                    </Group>
                  )}
                </Stack>
                <PasswordInput
                  {...form.getInputProps("password")}
                  label="Password"
                  placeholder=""
                  required
                  onChange={(e) => {
                    setPassword(e.currentTarget.value);
                    form.setFieldValue("password", e.currentTarget.value);
                  }}
                />
                <Stack>
                  <Text c="dimmed" size="xs">
                    Password must include:
                  </Text>
                  <Group align="center">
                    <HiCheckCircle
                      color={
                        password
                          ? passwordValidation.hasNumber
                            ? "green"
                            : "red"
                          : "black"
                      }
                    />
                    <Text size="xs" c={password && passwordValidation.hasNumber ? "green" : "dimmed"}>
                      Must contain 1 number
                    </Text>
                  </Group>
                  <Group align="center">
                    <HiCheckCircle
                      color={
                        password
                          ? passwordValidation.minLength
                            ? "green"
                            : "red"
                          : "black"
                      }
                    />
                    <Text size="xs" c={password && passwordValidation.minLength ? "green" : "dimmed"}>
                      Min 8 characters
                    </Text>
                  </Group>
                </Stack>
              </Stack>

              <Group justify="space-between" mt="xs">
                <Checkbox
                  label="Terms and Conditions"
                  checked={termsChecked}
                  onChange={(e) => {
                    setTermsChecked(e.currentTarget.checked);
                    // Hapus error jika checkbox dicentang
                    if (e.currentTarget.checked) {
                      setError("");
                    }
                  }}
                />
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

      {/* Modal untuk error registration */}
      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Registration Error</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Text size="sm" c="red" fw={500}>
              {error}
            </Text>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}

export default RegistrationPage;
