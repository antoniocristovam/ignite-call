import { Button, Text, TextInput } from "@ignite-ui/react";
import { Form, FormAnnotation } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O nome de usuário deve ter no mínimo 3 caracteres." })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O nome de usuário deve conter apenas letras e hifens.",
    })
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  const router = useRouter();

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data;

    await router.push(`/register?username=${username}`);
  }

  return (
    <>
      <Form as={"form"} onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size={"sm"}
          prefix="ignite.com/"
          placeholder="seu-usuario"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
          {...register("username")}
        />
        <Button size={"sm"} type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size={"sm"}>
          {errors.username
            ? errors.username.message
            : "Digite o nome do usuário desejado"}
        </Text>
      </FormAnnotation>
    </>
  );
}
