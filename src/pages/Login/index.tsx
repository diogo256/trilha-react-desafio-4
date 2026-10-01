import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Container, LoginContainer, Column, Spacing, Title } from "./styles";
import { defaultValues, IFormLogin } from "./types";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    email: yup
    .string()
    .email("E-mail inválido")
    .required("Campo obrigatório")
    .max(100, "E-mail inválido, deve ter no máximo 100 caracteres"),
    password: yup
      .string()
      .min(6, "No minimo 6 caracteres")
      .required("Campo obrigatório"),
  })
  .required();

const Login = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IFormLogin>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues,
    reValidateMode: "onChange",
  });

  const onSubmit = async (formData: IFormLogin) => {
    try {
      const { data } = await api.get(`/users?email=${formData.email}&senha=${formData.password}`);
      if (data.length === 1) {
        navigate("/feed");
      }else{
        alert("Usuário ou senha inválidos");
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  };

  return (
    <Container>
      <LoginContainer>
        <Column>
          <Title>Login</Title>
          <Spacing />
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Input
            name="email"
            placeholder="Email"
            control={control}
            errorMessage={errors?.email?.message}
          />
          <Spacing />
          <Input
            name="password"
            type="password"
            placeholder="Senha"
            control={control}
            errorMessage={errors?.password?.message}
          />
          <Spacing />
          <Button title="Entrar" type="submit" disabled={!isValid || isSubmitting} />
          </form>
        </Column>
      </LoginContainer>
    </Container>
  );
};

export default Login;
