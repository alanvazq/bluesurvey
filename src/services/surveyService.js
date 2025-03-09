import { useAuth } from "../auth/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

export const getSurveys = async (accessToken) => {
    try {
        const response = await fetch(`${API_URL}/surveys`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {

            const surveys = await response.json();
            return surveys;
        } else {
            return ("Error en la conexion");
        }
    } catch (error) {
        console.log(error);
    }
}

export const getSurveyData = async (id, accessToken) => {
    try {
        const response = await fetch(
            `${API_URL}/surveys/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (response.ok) {
            const survey = await response.json();
            return survey;
        } else {
            console.log('Error')
        }
    } catch (error) {
        console.log(error);
    }
};

export const deleteSurveyById = async (id, accessToken) => {
    try {
        const response = await fetch(`${API_URL}/surveys/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {
            const surveyDeleted = await response.json();
            return surveyDeleted;
        } else {
            console.log("Error al eliminar la encuesta");
        }

    } catch (error) {
        console.error("Error:", error);
    }
};

export const updateTitleOrDescription = async (id, title, description, accessToken) => {

    try {
        const response = await fetch(`${API_URL}/surveys/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                title,
                description,
            }),
        })

        if (response.ok) {
            const surveyUpdated = await response.json();
            return surveyUpdated;
        } else {
            console.log("Error al actualizar la encuesta")
        }

    } catch (error) {
        console.log(error);
    }
}

export const createNewQuestion = async (surveyId, questionTitle, answers, typeQuestion, accessToken) => {
    try {
        const response = await fetch(`${API_URL}/surveys/${surveyId}/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },

            body: JSON.stringify({
                typeQuestion: typeQuestion,
                question: questionTitle,
                answers: answers
            })
        })


        if (response.ok) {
            const question = await response.json();
            return question;
        } else {
            console.log("Error al crear la pregunta")
        }


    } catch (error) {
        console.log(error);
    }
}

export const updateQuestionById = async (id, questionId, answers, questionTiTle, typeQuestion, accessToken) => {

    try {
        const response = await fetch(`${API_URL}/surveys/${id}/questions`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                questionId: questionId,
                answers: answers,
                question: questionTiTle,
                typeQuestion: typeQuestion
            })
        })
        if (response.ok) {
            const updatedSurvey = await response.json();
            return updatedSurvey;
        } else {
            console.log("Error al actualizar la pregunta");
        }

    } catch (error) {
        console.log(error)
    }
}

export const deleteQuestionById = async (questionId, surveyId, accessToken) => {
    try {
        const response = await fetch(`${API_URL}/surveys/${surveyId}/questions/${questionId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },

        });

        if (response.ok) {
            const updatedSurvey = await response.json();
            return updatedSurvey;
        } else {
            console.log("Error al actualizar la encuesta");
        }

    } catch (error) {
        console.log(error);
    }
}

export const getPublicSurvey = async (surveyId) => {
    try {
        const response = await fetch(`${API_URL}/public/surveys/${surveyId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        if (response.ok) {
            const survey = await response.json();
            return survey;
        } else {
            console.log("Error al obtener la encuesta")
        }
    } catch (error) {
        console.log(error)
    }
}

export const saveAnswersForm = async (answers, surveyId) => {
    try {
        const response = await fetch(`${API_URL}/public/surveys`,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    answers,
                    surveyId,
                }),
            }
        );
        if (response.ok) {
            const savedAnswers = response.json();
            return savedAnswers;
        }

    } catch (error) {
        console.log(error)
    }

}

