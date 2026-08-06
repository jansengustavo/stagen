import { useState, useEffect } from "react";
import {
  Calendar,
  Button,
  Modal,
  Checkbox,
  Empty,
  Tag,
  Tooltip,
  Spin,
  Radio,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import type { Task } from "../../types/Task";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/tasks";
import { useNotification } from "../../hooks/useNotification";
import { useApp } from "../../hooks/useApp";
import { useTaskCategories } from "../../hooks/useTaskCategories";
import TaskModals from "../TaskModals";
import "./styles.scss";

dayjs.extend(weekday);

type ViewMode = "daily" | "weekly";

function CalendarTasks() {
  const { openNotification } = useNotification();
  const { token } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [operatingId, setOperatingId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<Dayjs>(dayjs());
  const { categories, setCategories } = useTaskCategories();
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      const result = await getTasks(token!);
      if (result.success && result.data) {
        setTasks(result.data);
      } else {
        openNotification("error", {
          title: "Failed to load tasks",
          description: result.message,
        });
      }
      setIsLoading(false);
    };

    fetchTasks();
  }, [openNotification, token]);

  const tasksForSelectedDate = tasks.filter(
    (task) => task.date === selectedDate.format("YYYY-MM-DD"),
  );

  const getWeekDays = (date: Dayjs): Dayjs[] => {
    const startOfWeek = date.weekday(0);
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  };

  const weekDays = getWeekDays(selectedDate);

  const getTasksForDate = (date: Dayjs) =>
    tasks.filter((task) => task.date === date.format("YYYY-MM-DD"));

  const handleDateChange = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleAddTask = (date?: Dayjs) => {
    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
    setEditDate(date || selectedDate);
    setEditCategory(undefined);
    if (date) setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDate(dayjs(task.date));
    setEditCategory(task.category);
    setIsModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (!editTitle.trim() || isSaving || !token) return;

    setIsSaving(true);

    const payload: Partial<Task> = {
      title: editTitle,
      description: editDescription,
      date: editDate.format("YYYY-MM-DD"),
      category: editCategory,
    };

    if (editingTask) {
      const result = await updateTask(token, editingTask.id, payload);
      if (result.success) {
        setTasks(
          tasks.map((t) =>
            t.id === editingTask.id
              ? { ...t, ...payload, completed: t.completed }
              : t,
          ),
        );
        openNotification("success", { title: "Task updated successfully" });
      } else {
        openNotification("error", {
          title: "Failed to update task",
          description: result.message,
        });
      }
    } else {
      const result = await createTask(token, {
        ...(payload as Omit<Task, "id">),
        completed: false,
      });
      if (result.success && result.data) {
        setTasks([...tasks, result.data]);
        openNotification("success", { title: "Task created successfully" });
      } else {
        openNotification("error", {
          title: "Failed to create task",
          description: result.message,
        });
      }
    }

    setIsSaving(false);
    setIsModalVisible(false);
    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleDeleteTask = async (id: string) => {
    if (!token) return;
    setOperatingId(id);
    const result = await deleteTask(token, id);
    if (result.success) {
      setTasks(tasks.filter((task) => task.id !== id));
      openNotification("success", {
        title: "Task deleted successfully",
      });
    } else {
      openNotification("error", {
        title: "Failed to delete task",
        description: result.message,
      });
    }
    setOperatingId(null);
  };

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || !token) return;

    setOperatingId(id);
    const result = await updateTask(token, id, { completed: !task.completed });
    if (result.success) {
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
      openNotification("success", {
        title: `Task marked as ${!task.completed ? "completed" : "pending"}`,
      });
    } else {
      openNotification("error", {
        title: "Failed to update task",
        description: result.message,
      });
    }
    setOperatingId(null);
  };

  const handlePrevWeek = () => {
    setSelectedDate((prev) => prev.subtract(7, "day"));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => prev.add(7, "day"));
  };

  const handleToday = () => {
    setSelectedDate(dayjs());
  };

  const getDateFullCellRender = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    const dateTasks = tasks.filter((task) => task.date === dateStr);
    const completedCount = dateTasks.filter((t) => t.completed).length;

    return (
      <div className="calendar-cell__content">
        {dateTasks.length > 0 && (
          <div className="calendar-cell__badge">
            <Tag
              color={
                completedCount === dateTasks.length ? "success" : "processing"
              }
            >
              {completedCount}/{dateTasks.length}
            </Tag>
          </div>
        )}
      </div>
    );
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "work":
        return "blue";

      case "study":
        return "purple";

      case "personal":
        return "green";

      default:
        return "orange";
    }
  };

  const handleDeleteCategory = (category: string) => {
    Modal.confirm({
      title: "Delete category",
      content: `Are you sure you want to delete "${category}"?`,
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
      },

      onOk: () => {
        const isBeingUsed = tasks.some((task) => task.category === category);

        if (isBeingUsed) {
          openNotification("warning", {
            title: "Category in use",
            description:
              "Remove or change the tasks using this category first.",
          });

          return;
        }

        setCategories(categories.filter((c) => c !== category));

        if (editCategory === category) {
          setEditCategory(undefined);
        }

        openNotification("success", {
          title: "Category deleted",
        });
      },
    });
  };

  const handleAddCategory = () => {
    const value = newCategory.trim();

    if (value && !categories.includes(value)) {
      setCategories([...categories, value]);
      setNewCategory("");
    }
  };

  return (
    <>
      <div className="view-toggle">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          className="view-toggle__group"
        >
          <Radio.Button value="daily">Daily</Radio.Button>
          <Radio.Button value="weekly">Weekly</Radio.Button>
        </Radio.Group>
      </div>
      <div
        className={`calendar-wrapper ${viewMode === "weekly" ? "calendar-wrapper--weekly" : ""}`}
      >
        {viewMode === "daily" ? (
          <>
            <div className="calendar-section">
              <Calendar
                fullscreen={false}
                value={selectedDate}
                onChange={handleDateChange}
                cellRender={getDateFullCellRender}
                className="custom-calendar"
              />
            </div>

            <div className="tasks">
              <div className="tasks__header">
                <h2 className="tasks__date">
                  {selectedDate.format("dddd, MMMM D, YYYY")}
                </h2>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddTask()}
                  className="tasks__add-btn"
                >
                  Add Task
                </Button>
              </div>

              <Spin spinning={isLoading}>
                <div className="tasks__list">
                  {tasksForSelectedDate.length > 0 ? (
                    tasksForSelectedDate.map((task) => (
                      <div
                        key={task.id}
                        className={`tasks__item${task.completed ? " tasks__item--completed" : ""}`}
                      >
                        <div className="tasks__checkbox">
                          <Checkbox
                            checked={task.completed}
                            disabled={operatingId === task.id}
                            onChange={() => handleToggleComplete(task.id)}
                          />
                        </div>

                        <div className="tasks__content">
                          <h3 className="tasks__title">{task.title}</h3>
                          {task.category && (
                            <Tag color={getCategoryColor(task.category)}>
                              {task.category}
                            </Tag>
                          )}
                          {task.description && (
                            <p className="tasks__desc">{task.description}</p>
                          )}
                        </div>

                        <div className="tasks__actions">
                          <Tooltip title="Edit">
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              disabled={operatingId === task.id}
                              onClick={() => handleEditTask(task)}
                              className="tasks__edit-btn"
                            />
                          </Tooltip>
                          <Tooltip
                            title={task.completed ? "Completed" : "Pending"}
                          >
                            {task.completed ? (
                              <CheckCircleOutlined className="tasks__icon tasks__icon--completed" />
                            ) : (
                              <ClockCircleOutlined className="tasks__icon tasks__icon--pending" />
                            )}
                          </Tooltip>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            loading={operatingId === task.id}
                            onClick={() => handleDeleteTask(task.id)}
                            className="tasks__delete-btn"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty
                      description="No tasks for this date"
                      style={{ marginTop: "40px" }}
                    />
                  )}
                </div>
              </Spin>
            </div>
          </>
        ) : (
          <Spin spinning={isLoading}>
            <div className="weekly-view">
              <div className="weekly-view__header">
                <div className="weekly-view__nav">
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    onClick={handlePrevWeek}
                    className="weekly-view__nav-btn"
                  />
                  <h2 className="weekly-view__title">
                    {weekDays[0].format("MMM D")} –{" "}
                    {weekDays[6].format("MMM D, YYYY")}
                  </h2>
                  <Button
                    type="text"
                    icon={<RightOutlined />}
                    onClick={handleNextWeek}
                    className="weekly-view__nav-btn"
                  />
                </div>
                <Button
                  type="default"
                  onClick={handleToday}
                  className="weekly-view__today-btn"
                >
                  Today
                </Button>
              </div>

              <div className="weekly-view__grid">
                {weekDays.map((day) => {
                  const dayTasks = getTasksForDate(day);
                  const isToday = day.isSame(dayjs(), "day");
                  const isSelected = day.isSame(selectedDate, "day");

                  return (
                    <div
                      key={day.format("YYYY-MM-DD")}
                      className={`weekly-view__day ${isToday ? "weekly-view__day--today" : ""} ${isSelected ? "weekly-view__day--selected" : ""}`}
                    >
                      <div className="weekly-view__day-header">
                        <div className="weekly-view__day-info">
                          <span className="weekly-view__day-name">
                            {day.format("ddd")}
                          </span>
                          <span
                            className={`weekly-view__day-number ${isToday ? "weekly-view__day-number--today" : ""}`}
                          >
                            {day.format("D")}
                          </span>
                        </div>
                        {dayTasks.length > 0 && (
                          <Tag
                            color={
                              dayTasks.every((t) => t.completed)
                                ? "success"
                                : "processing"
                            }
                            className="weekly-view__day-count"
                          >
                            {dayTasks.filter((t) => t.completed).length}/
                            {dayTasks.length}
                          </Tag>
                        )}
                      </div>

                      <div className="weekly-view__day-tasks">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`weekly-view__task ${task.completed ? "weekly-view__task--completed" : ""}`}
                          >
                            <Checkbox
                              checked={task.completed}
                              disabled={operatingId === task.id}
                              onChange={() => handleToggleComplete(task.id)}
                              className="weekly-view__task-check"
                            />
                            <div className="weekly-view__task-info">
                              <span className="weekly-view__task-title">
                                {task.title}
                              </span>
                              {task.category && (
                                <Tag
                                  color={getCategoryColor(task.category)}
                                  className="weekly-view__task-cat"
                                >
                                  {task.category}
                                </Tag>
                              )}
                            </div>
                            <div className="weekly-view__task-actions">
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                disabled={operatingId === task.id}
                                onClick={() => handleEditTask(task)}
                                className="weekly-view__task-edit"
                              />
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                loading={operatingId === task.id}
                                onClick={() => handleDeleteTask(task.id)}
                                className="weekly-view__task-delete"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddTask(day)}
                        className="weekly-view__add-btn"
                      >
                        Add
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Spin>
        )}

        <TaskModals
          isModalVisible={isModalVisible}
          editingTask={editingTask}
          editTitle={editTitle}
          editDescription={editDescription}
          editDate={editDate}
          editCategory={editCategory}
          categories={categories}
          newCategory={newCategory}
          isSaving={isSaving}
          onEditTitleChange={(value) => setEditTitle(value)}
          onEditDescriptionChange={(value) => setEditDescription(value)}
          onEditDateChange={(date) => setEditDate(date)}
          onEditCategoryChange={(value) => setEditCategory(value)}
          onNewCategoryChange={(value) => setNewCategory(value)}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onSave={handleSaveTask}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingTask(null);
          }}
        />
      </div>
    </>
  );
}

export default CalendarTasks;
