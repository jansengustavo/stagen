import { Form, Input, Button } from "antd";
import {
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  InstagramLogoIcon,
} from "@phosphor-icons/react";
import Navbar from "../../../components/Navbar";
import "./styles.scss";

function Contact() {
  const [form] = Form.useForm();

  const socials = [
    { icon: GithubLogoIcon, url: "#", label: "GitHub" },
    { icon: LinkedinLogoIcon, url: "#", label: "LinkedIn" },
    { icon: InstagramLogoIcon, url: "#", label: "Instagram" },
  ];

  const handleSubmit = (values: { firstName: string; lastName: string; email: string; message: string }) => {
    const subject = encodeURIComponent("Contact Form - Stagen");
    const body = encodeURIComponent(
      `First Name: ${values.firstName}\nLast Name: ${values.lastName}\nEmail: ${values.email}\n\nMessage:\n${values.message}`,
    );
    window.location.href = `mailto:stagen.support@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="contact">
      <Navbar activeLink="contact" />

      <div className="contact__container">
        <div className="contact__left">
          <h1 className="contact__title">Get in Touch</h1>
          <p className="contact__subtitle">We would like to hear from you!</p>
          <p className="contact__description">
            If you have any inquiries or just want to say hi, please use the
            contact form!
          </p>

          <a href="mailto:stagen.support@gmail.com" className="contact__email">
            <EnvelopeSimpleIcon size={24} weight="fill" />
            <span>stagen.support@gmail.com</span>
          </a>

          <div className="contact__socials">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  className="contact__social-link"
                  title={social.label}
                >
                  <Icon size={24} weight="fill" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="contact__right">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="contact__form"
          >
            <div className="contact__form-row">
              <Form.Item
                name="firstName"
                label="First Name"
                required
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
                className="contact__form-col"
              >
                <Input placeholder="Your first name" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                required
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
                className="contact__form-col"
              >
                <Input placeholder="Your last name" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email"
              required
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="your.email@example.com" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              required
              rules={[{ required: true, message: "Please enter your message" }]}
            >
              <Input.TextArea rows={6} placeholder="Your message here..." />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="contact__submit-btn"
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
