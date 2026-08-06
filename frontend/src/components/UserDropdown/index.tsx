import { useState, useEffect } from "react";
import {
  Dropdown,
  Avatar,
  Spin,
  Drawer,
  Modal,
  Form,
  Input,
  Button,
} from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import { useApp } from "../../hooks/useApp";
import { getUser, updateUser, deleteUser } from "../../services/user";
import type { User } from "../../types/User";
import "./styles.scss";

function UserDropdown() {
  const navigate = useNavigate();
  const { openNotification } = useNotification();
  const { logout, token } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileForm] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }

      if (!token) return;
      const result = await getUser(token, userId);
      if (result.success) {
        setUser(result.data as User);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const handleSettings = () => {
    setIsProfileOpen(true);
  };

  const handleLogout = () => {
    openNotification("info", {
      title: "Logging out...",
      description: "You have been logged out successfully.",
    });
    logout();
    navigate("/");
  };

  const handleProfileSubmit = async (values: {
    name: string;
    email: string;
    password?: string;
  }) => {
    if (!user) return;
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        name: values.name,
        email: values.email,
      };
      if (values.password) {
        payload.password = values.password;
      }

      const result = await updateUser(token!, user.id, payload);
      if (result.success && result.data) {
        openNotification("success", {
          title: "Perfil atualizado com sucesso!",
        });
        setUser(result.data as User);
        setIsProfileOpen(false);
        profileForm.resetFields();
      } else {
        openNotification("error", {
          title: result.message || "Erro ao atualizar perfil",
        });
      }
    } catch {
      openNotification("error", { title: "Erro ao atualizar perfil" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!user) return;
    Modal.confirm({
      title: "Tem certeza que deseja excluir sua conta?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Esta ação não pode ser desfeita. Todos os seus dados serão removidos permanentemente.",
      okText: "Sim, excluir minha conta",
      okType: "danger",
      cancelText: "Cancelar",
      okButtonProps: { loading: isDeleting },
      onOk: async () => {
        setIsDeleting(true);
        try {
          const result = await deleteUser(token!, user.id);
          if (result.success) {
            openNotification("success", {
              title: "Conta excluída com sucesso",
            });
            logout();
          } else {
            openNotification("error", {
              title: result.message || "Erro ao excluir conta",
            });
          }
        } catch {
          openNotification("error", { title: "Erro ao excluir conta" });
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
    profileForm.resetFields();
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="user-dropdown__profile-section">
          <div className="user-dropdown__user-info">
            <h4>{user?.name}</h4>
            <p>{user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: handleSettings,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (loading) {
    return <Spin size="small" />;
  }

  return (
    <>
      <Dropdown
        menu={{ items: items }}
        trigger={["click"]}
        className="user-dropdown"
      >
        <div className="user-dropdown__trigger">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className="user-dropdown__avatar"
          />
        </div>
      </Dropdown>

      <Drawer
        className="settings-drawer"
        title="Configurações"
        open={isProfileOpen}
        onClose={handleProfileClose}
        size={420}
      >
        <h3 style={{ marginBottom: 16, fontWeight: 600 }}>
          Informações do Perfil
        </h3>

        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileSubmit}
          initialValues={{ name: user?.name, email: user?.email }}
        >
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: "Por favor, insira seu nome" }]}
          >
            <Input placeholder="Seu nome" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Por favor, insira seu email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input placeholder="seu@email.com" type="email" />
          </Form.Item>

          <Form.Item label="Nova Senha" name="password">
            <Input.Password placeholder="Deixe em branco para manter a atual" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={saving}>
              Salvar alterações
            </Button>
          </Form.Item>
        </Form>

        <hr
          style={{
            margin: "24px 0",
            border: "none",
            borderTop: "1px solid #f0f0f0",
          }}
        />

        <h3 style={{ marginBottom: 8, fontWeight: 600, color: "#ff4d4f" }}>
          Zona de Perigo
        </h3>
        <p style={{ marginBottom: 16, color: "#999", fontSize: 13 }}>
          Exclua sua conta e todos os dados associados. Esta ação não pode ser
          desfeita.
        </p>
        <Button danger block onClick={handleDeleteAccount}>
          Excluir minha conta
        </Button>
      </Drawer>
    </>
  );
}

export default UserDropdown;
