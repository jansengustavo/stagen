import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import TasksCalendar from "../../../components/TasksCalendar";
import QuizModal from "../../../components/QuizModal";
import "./styles.scss";

function Tasks() {
  const location = useLocation();
  const state = location.state as { quizPending?: boolean } | null;
  const [quizOpen, setQuizOpen] = useState(state?.quizPending ?? false);

  return (
    <div className="tasks">
      <Navbar activeLink="tasks" />

      <main className="tasks__content">
        <TasksCalendar />
      </main>

      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

export default Tasks;
