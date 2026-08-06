import { Modal, Input, DatePicker, Space, Tag, Select, Button } from "antd";
import type { Dayjs } from "dayjs";
import type { Task } from "../../types/Task";
import "./styles.scss";

interface TaskModalsProps {
  isModalVisible: boolean;
  editingTask: Task | null;
  editTitle: string;
  editDescription: string;
  editDate: Dayjs;
  editCategory: string | undefined;
  categories: string[];
  newCategory: string;
  isSaving: boolean;
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onEditDateChange: (date: Dayjs) => void;
  onEditCategoryChange: (value: string | undefined) => void;
  onNewCategoryChange: (value: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (category: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

function TaskModals({
  isModalVisible,
  editingTask,
  editTitle,
  editDescription,
  editDate,
  editCategory,
  categories,
  newCategory,
  isSaving,
  onEditTitleChange,
  onEditDescriptionChange,
  onEditDateChange,
  onEditCategoryChange,
  onNewCategoryChange,
  onAddCategory,
  onDeleteCategory,
  onSave,
  onCancel,
}: TaskModalsProps) {
  return (
    <Modal
      title={editingTask ? "Edit Task" : "Add New Task"}
      open={isModalVisible}
      onOk={onSave}
      onCancel={onCancel}
      okText={editingTask ? "Update" : "Save"}
      cancelText="Cancel"
      okButtonProps={{ loading: isSaving }}
      className="task-modal"
    >
      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        <Input
          placeholder="Task title"
          value={editTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
          onPressEnter={onSave}
        />
        <Input.TextArea
          placeholder="Task description (optional)"
          value={editDescription}
          onChange={(e) => onEditDescriptionChange(e.target.value)}
          rows={3}
        />
        <DatePicker
          value={editDate}
          onChange={(date) => date && onEditDateChange(date)}
          style={{ width: "100%" }}
        />

        <Select
          placeholder="Select a category (optional)"
          value={editCategory}
          allowClear
          onChange={(value) => onEditCategoryChange(value)}
          options={categories.map((cat) => ({
            label: cat,
            value: cat,
          }))}
        />
        <Input
          placeholder="New category"
          value={newCategory}
          onChange={(e) => onNewCategoryChange(e.target.value)}
          addonAfter={
            <Button type="link" onClick={onAddCategory}>
              Add
            </Button>
          }
        />
        <div>
          {categories.map((category) => (
            <Tag
              key={category}
              closable
              onClose={(e) => {
                e.preventDefault();
                onDeleteCategory(category);
              }}
            >
              {category}
            </Tag>
          ))}
        </div>
      </Space>
    </Modal>
  );
}

export default TaskModals;
