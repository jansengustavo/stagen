import {
  CalendarIcon,
  ClockIcon,
  ChatCircleDotsIcon,
} from "@phosphor-icons/react";
import Navbar from "../../../components/Navbar";
import "./styles.scss";

function OurServices() {
  const services = [
    {
      id: 1,
      title: "Tasks Calendar",
      description:
        "Organize and manage your tasks efficiently with our interactive calendar. Plan your day, week, or month and stay on top of your commitments.",
      icon: CalendarIcon,
      color: "blue-01",
    },
    {
      id: 2,
      title: "Timer",
      description:
        "Track your productivity with our integrated timer. Perfect for Pomodoro sessions or any time-based task tracking you need.",
      icon: ClockIcon,
      color: "blue-02",
    },
    {
      id: 3,
      title: "Smart Questionary",
      description:
        "Answer a few simple questions and get personalized timer recommendations tailored to your work style and preferences.",
      icon: ChatCircleDotsIcon,
      color: "blue-03",
    },
  ];

  return (
    <div className="services">
      <Navbar activeLink="services" />

      <header className="services__header">
        <h1 className="services__title">Our Services</h1>
        <p className="services__subtitle">
          Discover our suite of tools designed to boost your productivity
        </p>
      </header>

      <section className="services__cards-container">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.id} className="services__card">
              <div
                className={`services__card-icon services__card-icon--${service.color}`}
              >
                <Icon size={48} weight="fill" />
              </div>
              <h2 className="services__card-title">{service.title}</h2>
              <p className="services__card-description">
                {service.description}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default OurServices;
