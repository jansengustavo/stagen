import { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import type { Login } from "../../types/Login";
import { performLogin } from "../../services/login";
import { createUser, getUser } from "../../services/user";
import { useNotification } from "../../hooks/useNotification";
import { useApp } from "../../hooks/useApp";
import "./styles.scss";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

function LoginModal({ open, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { openNotification } = useNotification();
  const { login } = useApp();

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleLoginSubmit = async (values: Login) => {
    setLoading(true);
    try {
      const result = await performLogin(values);
      if (result.success && result.data) {
        login(result.data.token, result.data.userId);
        openNotification("success", { title: "Login realizado com sucesso!" });
        onClose();
        form.resetFields();

        const userResult = await getUser(result.data.token, result.data.userId);
        if (userResult.success && !userResult.data?.profile) {
          navigate("/tasks", { state: { quizPending: true } });
        } else {
          navigate("/tasks");
        }
      } else {
        openNotification("error", {
          title: result.message || "Erro ao fazer login",
        });
      }
    } catch {
      openNotification("error", { title: "Erro ao fazer login" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (values: {
    username: string;
    password: string;
    email: string;
    name: string;
  }) => {
    setLoading(true);
    try {
      const result = await createUser({
        email: values.email,
        name: values.name,
        password: values.password,
      });
      if (result.success) {
        openNotification("success", {
          title: "Usuário criado com sucesso! Faça login para continuar.",
        });
        form.resetFields();
        setIsSignUp(false);
      } else {
        openNotification("error", {
          title: result.message || "Erro ao criar usuário",
        });
      }
    } catch {
      openNotification("error", { title: "Erro ao criar usuário" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
    setIsSignUp(false);
  };

  return (
    <Modal
      className="login-modal"
      title={isSignUp ? "Criar Conta" : "Login"}
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={isSignUp ? handleSignUpSubmit : handleLoginSubmit}
      >
        {isSignUp && (
          <>
            <Form.Item
              label="Nome Completo"
              name="name"
              rules={[
                { required: true, message: "Por favor, insira seu nome" },
              ]}
            >
              <Input placeholder="Insira seu nome completo" />
            </Form.Item>
          </>
        )}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Por favor, insira seu email" },
            { type: "email", message: "Email inválido" },
          ]}
        >
          <Input placeholder="Insira seu email" type="email" />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: "Por favor, insira a senha" }]}
        >
          <Input.Password placeholder="Insira sua senha" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {isSignUp ? "Criar Conta" : "Entrar"}
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        {!isSignUp ? (
          <span>
            Não tem uma conta?{" "}
            <Button type="link" onClick={handleSignUpClick}>
              Criar uma
            </Button>
          </span>
        ) : (
          <span>
            Já tem uma conta?{" "}
            <Button type="link" onClick={() => setIsSignUp(false)}>
              Fazer login
            </Button>
          </span>
        )}
      </div>
    </Modal>
  );
}

export default LoginModal;
