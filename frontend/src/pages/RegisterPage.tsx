import { Box, Typography, TextField, Button } from "@mui/material";
import Container from "@mui/material/Container";
import { useRef, useState } from "react";
import { beasURL } from "../constantes/beasURL";
import { useAuth } from "../context/Auth/AuthContext";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();

  const fields = [
    { name: "firstname", label: "First Name", type: "text", ref: firstnameRef },
    { name: "lastname", label: "Last Name", type: "text", ref: lastnameRef },
    { name: "email", label: "Email", type: "email", ref: emailRef },
    { name: "password", label: "Password", type: "password", ref: passwordRef },
  ];

  const clearForm = () => {
    firstnameRef.current!.value = "";
    lastnameRef.current!.value = "";
    emailRef.current!.value = "";
    passwordRef.current!.value = "";
  };

  const handleSubmit = async () => {
    
    setError("");
    setSuccess("");
    const formData = {
      firstName: firstnameRef.current?.value,
      lastName: lastnameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
    if (
      !formData.email ||
      !formData.firstName ||
      formData.lastName ||
      formData.password
    ) {
      setError("Chech submitted data");
      return;
    }
    
    try {
      const response = await fetch(`${beasURL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        setError("Unable to register user, please try different credentials!");
        return;
      }

      const token = await response.json();
      if (!token) {
        setError("Incorrect token");
        return;
      }
      login(formData.email, token);
      console.log("Success:", token);
      setSuccess("Account created successfully!");
      clearForm();
    } catch (error) {
      console.error("Network or parsing error:", error);
      setError("Network error, please try again!");
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h4">Register new account</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            variant="outlined"
            fullWidth
            sx={{ maxWidth: 400 }}
            inputRef={field.ref}
          />
        ))}
        <Button
          variant="contained"
          fullWidth
          sx={{ maxWidth: 400, mt: 2 }}
          onClick={handleSubmit}
        >
          Register
        </Button>
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
        {success && <Typography sx={{ color: "green" }}>{success}</Typography>}
      </Box>
    </Container>
  );
};

export default RegisterPage;
