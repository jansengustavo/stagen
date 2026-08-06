import { LeafIcon, UsersIcon, LightbulbIcon } from "@phosphor-icons/react";
import Logo from "../../../components/Logo";
import Navbar from "../../../components/Navbar";
import "./styles.scss";

function Home() {
  return (
    <div className="home">
      <Navbar activeLink="home" />

      <main className="home__canvas">
        <section className="home__hero-section">
          <div className="home__hero-card-left">
            <h1 className="home__hero-title">
              We build solutions for a better tomorrow.
            </h1>
            <p className="home__hero-description">
              Stagen is a software and innovation company focused on creating
              meaningful impact through thoughtful solutions.
            </p>
          </div>

          <div className="home__hero-card-right">
            <div className="home__center-logo-container">
              <Logo size={120} showText={true} />
            </div>
          </div>
        </section>

        <section className="home__features-row">
          <div className="home__feature-item">
            <div className="home__feature-icon-wrapper">
              <LeafIcon size={32} weight="light" />
            </div>
            <h3 className="home__feature-title">Sustainable</h3>
            <p className="home__feature-text">
              We prioritize sustainable practices in everything we do.
            </p>
          </div>

          <div className="home__feature-item">
            <div className="home__feature-icon-wrapper">
              <UsersIcon size={32} weight="light" />
            </div>
            <h3 className="home__feature-title">Human-Centered</h3>
            <p className="home__feature-text">
              We design with people at the heart of every decision.
            </p>
          </div>

          <div className="home__feature-item">
            <div className="home__feature-icon-wrapper">
              <LightbulbIcon size={32} weight="light" />
            </div>
            <h3 className="home__feature-title">Innovative</h3>
            <p className="home__feature-text">
              We combine creativity and technology to drive meaningful change.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
