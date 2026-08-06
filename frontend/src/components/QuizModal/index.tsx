import { useState, useEffect } from "react";
import { Button, Radio, Progress, Tooltip } from "antd";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import profiles from "../../data/profiles";
import questions from "../../data/questions";
import { useApp } from "../../hooks/useApp";
import { updateUser } from "../../services/user";
import "./styles.scss";

type QuizStatus = "idle" | "answering" | "finished";

function getDominantLetter(answers: string[]): string {
  const count: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  answers.forEach((l) => count[l]++);
  return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
}

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
}

function QuizModal({ open, onClose }: QuizModalProps) {
  const { token } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<QuizStatus>("idle");
  const [answers, setAnswers] = useState<string[]>([]);
  const [finalProfile, setFinalProfile] = useState<
    (typeof profiles)[string] | null
  >(null);

  const currentQuestion = questions[currentIndex];
  const progress = Math.round((currentIndex / questions.length) * 100);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  function handleStart() {
    setStatus("answering");
  }

  async function handleConfirm() {
    if (!selectedOption) return;

    const updatedAnswers = [...answers, selectedOption];
    setAnswers(updatedAnswers);

    const isLast = currentIndex === questions.length - 1;

    if (isLast) {
      const dominant = getDominantLetter(updatedAnswers);
      const profile = profiles[dominant];
      setFinalProfile(profile);

      const userId = localStorage.getItem("userId");
      if (token && userId) {
        await updateUser(token, userId, { profile: profile.id });
      }

      setStatus("finished");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  }

  function handleReset() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setStatus("idle");
    setAnswers([]);
    setFinalProfile(null);
  }

  if (!open) return null;

  return (
    <div className="quiz-modal-overlay" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quiz quiz--modal">
          <div className="quiz__container">
            {status === "idle" && (
              <div className="quiz__start">
                <span className="quiz__eyebrow">
                  Diagnóstico de Produtividade
                </span>
                <h1 className="quiz__title">Qual é o seu perfil?</h1>
                <p className="quiz__subtitle">
                  5 perguntas · Descubra sua estratégia ideal de foco
                </p>
                <Button
                  type="primary"
                  size="large"
                  className="quiz__btn-action"
                  onClick={handleStart}
                >
                  Começar
                </Button>
              </div>
            )}

            {status === "answering" && (
              <>
                <div className="quiz__header">
                  <div className="quiz__meta">
                    <span className="quiz__counter">
                      Pergunta {currentIndex + 1} de {questions.length}
                    </span>
                  </div>
                  <Progress
                    percent={progress}
                    showInfo={false}
                    strokeColor="var(--primary)"
                    railColor="var(--progress-trail)"
                    className="quiz__progress"
                  />
                </div>

                <div className="quiz__body">
                  <p className="quiz__question">{currentQuestion.question}</p>

                  <Radio.Group
                    className="quiz__options"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    {currentQuestion.options.map((opt) => (
                      <Radio
                        key={opt.letter}
                        value={opt.letter}
                        className="quiz__option"
                      >
                        <span className="quiz__option-letter">
                          {opt.letter}
                        </span>
                        <span className="quiz__option-text">{opt.text}</span>
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>

                <div className="quiz__controls">
                  <Button
                    type="primary"
                    size="large"
                    className="quiz__btn-action"
                    disabled={!selectedOption}
                    onClick={handleConfirm}
                  >
                    {currentIndex === questions.length - 1
                      ? "Ver resultado"
                      : "Próxima"}
                  </Button>
                  <Tooltip title="Reiniciar quiz">
                    <Button
                      type="text"
                      size="large"
                      className="quiz__btn-reset"
                      onClick={handleReset}
                      icon={
                        <ArrowCounterClockwiseIcon size={24} weight="bold" />
                      }
                    />
                  </Tooltip>
                </div>
              </>
            )}

            {status === "finished" && finalProfile && (
              <div className="quiz__result">
                <div className="quiz__result-header">
                  <span className="quiz__eyebrow">{finalProfile.subtitle}</span>
                  <h2 className="quiz__result-title">{finalProfile.title}</h2>
                </div>

                <div className="quiz__result-cards">
                  <div className="quiz__result-card">
                    <span className="quiz__result-card-label">Diagnóstico</span>
                    <p className="quiz__result-card-text">
                      {finalProfile.diagnosis}
                    </p>
                  </div>
                  <div className="quiz__result-card">
                    <span className="quiz__result-card-label">Como agir</span>
                    <p className="quiz__result-card-text">
                      {finalProfile.action}
                    </p>
                  </div>
                  <div
                    className="quiz__result-card quiz__result-card--highlight"
                    style={
                      {
                        "--profile-color": finalProfile.color,
                      } as React.CSSProperties
                    }
                  >
                    <span className="quiz__result-card-label">
                      ⏱ Tempo de foco ideal
                    </span>
                    <p className="quiz__result-card-text">
                      {finalProfile.focus}
                    </p>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  className="quiz__btn-action"
                  onClick={onClose}
                >
                  Continuar
                </Button>

                <Button
                  type="text"
                  size="large"
                  className="quiz__btn-restart"
                  onClick={handleReset}
                  icon={<ArrowCounterClockwiseIcon size={18} weight="bold" />}
                >
                  Refazer quiz
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizModal;
