import { Question } from "./Question";

export const SurveyQuestions = ({
  questions,
  surveyId,
  accessToken,
  onDeleteQuestion,
  onEdit,
  editingQuestionId,
  setChangeInQues,
  onEditModeCancel,
  onRefreshSurvey,
  lastQuestionCreatedRef,
}) => {
  return (
    <div className="container_questions">
      {questions.map((question, index) => {
        return (
          <Question
            key={question._id}
            surveyId={surveyId}
            accessToken={accessToken}
            id={question._id}
            typeQuestion={question.typeQuestion}
            questionSurvey={question.question}
            answers={question.answers}
            deleteQuestion={onDeleteQuestion}
            onEdit={onEdit}
            isEditing={editingQuestionId === question._id}
            setChangeInQue={setChangeInQues}
            cancelEditMode={onEditModeCancel}
            handleRefreshSurvey={onRefreshSurvey}
            ref={index === questions.length - 1 ? lastQuestionCreatedRef : null}
          />
        );
      })}
    </div>
  );
};
