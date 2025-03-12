import { useEffect, useRef } from "react";

export const SurveyHeader = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}) => {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const adjustTextArea = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustTextArea(titleRef);
    adjustTextArea(descriptionRef);
  }, [title, description]);

  return (
    <div className="container_title_description">
      <textarea
        className="edit_input_title edit_input"
        name="title"
        id="title"
        value={title}
        ref={titleRef}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Título de la encuesta"
      />
      <textarea
        className="edit_input_description edit_input"
        name="description"
        id="description"
        value={description}
        ref={descriptionRef}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Descripción de la encuesta"
      />
    </div>
  );
};
