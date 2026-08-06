import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Radio, Tooltip, Modal, InputNumber } from "antd";
import { ArrowCounterClockwiseIcon, GearSixIcon } from "@phosphor-icons/react";
import Navbar from "../../../components/Navbar";
import "./styles.scss";

interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
};

const SETTINGS_KEY = "stagen-timer-settings";
const STATE_KEY = "stagen-timer-state";

function loadSettings(): TimerSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    void 0;
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: TimerSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

interface TimerPersistedState {
  mode: "work" | "shortBreak" | "longBreak";
  secondsLeft: number;
  cycleCount: number;
}

function loadTimerState(): TimerPersistedState | null {
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    void 0;
  }
  return null;
}

function saveTimerState(state: TimerPersistedState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

type TimerMode = "work" | "shortBreak" | "longBreak";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getTimerConfig(mode: TimerMode, settings: TimerSettings) {
  const map: Record<
    TimerMode,
    { label: string; duration: number; color: string }
  > = {
    work: {
      label: "Pomodoro",
      duration: settings.workDuration * 60,
      color: "var(--red-01)",
    },
    shortBreak: {
      label: "Short Break",
      duration: settings.shortBreakDuration * 60,
      color: "var(--blue-01)",
    },
    longBreak: {
      label: "Long Break",
      duration: settings.longBreakDuration * 60,
      color: "var(--yellow-01)",
    },
  };
  return map[mode];
}

function Timer() {
  const [settings, setSettings] = useState<TimerSettings>(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draftSettings, setDraftSettings] =
    useState<TimerSettings>(DEFAULT_SETTINGS);

  const savedState = loadTimerState();

  const [mode, setMode] = useState<TimerMode>(() => savedState?.mode ?? "work");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (savedState) return savedState.secondsLeft;
    return getTimerConfig("work", loadSettings()).duration;
  });
  const [cycleCount, setCycleCount] = useState(
    () => savedState?.cycleCount ?? 0,
  );
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setSecondsLeft(getTimerConfig(mode, settings).duration);
  }, [mode, settings]);

  const handleSessionEnd = useCallback(() => {
    setCycleCount((prevCount) => {
      const nextCount = prevCount + 1;
      setMode((currentMode) => {
        if (currentMode === "work") {
          return nextCount % 4 === 0 ? "longBreak" : "shortBreak";
        }
        return "work";
      });
      return nextCount;
    });
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          handleSessionEnd();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, handleSessionEnd]);

  useEffect(() => {
    saveTimerState({ mode, secondsLeft, cycleCount });
  }, [mode, secondsLeft, cycleCount]);

  const currentSession = getTimerConfig(mode, settings);

  function handleModeChange(value: TimerMode) {
    setMode(value);
    setRunning(false);
  }

  function handleReset() {
    setRunning(false);
    setSecondsLeft(currentSession.duration);
  }

  function openSettings() {
    setDraftSettings({ ...settings });
    setSettingsOpen(true);
  }

  function handleSaveSettings() {
    saveSettings(draftSettings);
    setSettings(draftSettings);
    setSettingsOpen(false);
  }

  return (
    <div className="timer">
      <Navbar activeLink="timer" />

      <div className="timer__backdrop" />

      <main className="timer__main">
        <div className="timer__container">
          <div className="timer__modes">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={mode}
              onChange={(event) => handleModeChange(event.target.value)}
              className="timer__mode-group"
            >
              <Radio.Button value="work" className="timer__mode-btn">
                Pomodoro
              </Radio.Button>
              <Radio.Button value="shortBreak" className="timer__mode-btn">
                Short Break
              </Radio.Button>
              <Radio.Button value="longBreak" className="timer__mode-btn">
                Long Break
              </Radio.Button>
            </Radio.Group>
          </div>

          <div className="timer__display">
            <span className="timer__time">{formatTime(secondsLeft)}</span>
          </div>

          <div className="timer__controls">
            <Button
              type="primary"
              size="large"
              className="timer__btn-start"
              onClick={() => setRunning((prev) => !prev)}
            >
              {running ? "Pause" : "Start"}
            </Button>
            <Tooltip title="Reset timer">
              <Button
                type="text"
                size="large"
                className="timer__btn-reset"
                onClick={handleReset}
                icon={<ArrowCounterClockwiseIcon size={24} weight="bold" />}
              />
            </Tooltip>
            <Tooltip title="Configuration">
              <Button
                type="text"
                size="large"
                className="timer__btn-settings"
                onClick={openSettings}
                icon={<GearSixIcon size={24} weight="bold" />}
              />
            </Tooltip>
          </div>
        </div>
      </main>

      <Modal
        title="Timer Configuration"
        open={settingsOpen}
        onOk={handleSaveSettings}
        onCancel={() => setSettingsOpen(false)}
        okText="Save"
        cancelText="Cancel"
        className="timer__settings-modal"
      >
        <div className="timer__settings-form">
          <div className="timer__settings-field">
            <label>Pomodoro (minutes)</label>
            <InputNumber
              min={1}
              max={120}
              value={draftSettings.workDuration}
              onChange={(value) =>
                setDraftSettings((prev) => ({
                  ...prev,
                  workDuration: value ?? 25,
                }))
              }
              style={{ width: "100%" }}
            />
          </div>
          <div className="timer__settings-field">
            <label>Short Break (minutes)</label>
            <InputNumber
              min={1}
              max={60}
              value={draftSettings.shortBreakDuration}
              onChange={(value) =>
                setDraftSettings((prev) => ({
                  ...prev,
                  shortBreakDuration: value ?? 5,
                }))
              }
              style={{ width: "100%" }}
            />
          </div>
          <div className="timer__settings-field">
            <label>Long Break (minutes)</label>
            <InputNumber
              min={1}
              max={120}
              value={draftSettings.longBreakDuration}
              onChange={(value) =>
                setDraftSettings((prev) => ({
                  ...prev,
                  longBreakDuration: value ?? 15,
                }))
              }
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Timer;
