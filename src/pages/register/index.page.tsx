import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/src/lib/axios";
import { AxiosError } from "axios";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O nome de usuário deve ter no mínimo 3 caracteres." })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O nome de usuário deve conter apenas letras e hifens.",
    })
    .transform((username) => username.toLowerCase()),

  name: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      setValue("username", router.query.username as string);
    }
  }, [router.query.username, setValue]);

  async function handleRegister(data: RegisterFormData) {
    console.log(data);
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      router.push("/register/connect-calendar");
    } catch (error) {
      console.log(error instanceof AxiosError && error?.response?.data?.error);

      if (error instanceof AxiosError && error?.response?.data?.error) {
        alert(error?.response?.data?.error);
        return;
      }

      console.log(error);
    }
  }

  return (
    <Container>
      <Header>
        <Heading as={"strong"}>Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as={"form"} onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size={"sm"}>Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
            {...register("username")}
          />
          {errors.username && (
            <FormError size={"sm"}>{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size={"sm"}>Nome completo</Text>
          <TextInput
            placeholder="Seu nome"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
            {...register("name")}
          />
          {errors.name && (
            <FormError size={"sm"}>{errors.name.message}</FormError>
          )}
        </label>
        <Button type={"submit"} disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
