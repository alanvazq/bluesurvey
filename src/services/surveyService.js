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

        return response;

    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
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

        return response;
    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
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

        return response;
    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
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

        return response;

    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
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

        return response;

    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
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

        return response;

    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
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

        return response;

    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
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
        return response;
    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
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

        return response;

    } catch (error) {
        throw new Error("Error en la conexión con el servidor");
    }

}

