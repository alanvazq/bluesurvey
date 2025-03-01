import { useAuth } from "../auth/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL

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

        if (!response.ok) {
            return await response.json();
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

export const updateQuestionById = async (id, questionId, answers, questionTiTle, typeQuestion, accessToken) => {

    const newAnswer = answers.filter((ans) => ans._id.startsWith("n-"));

    if (newAnswer.length > 0) {

        answers = answers.filter((ans) => !ans._id.startsWith("n-"));
        const newAnswers = newAnswer.map(({ _id, ...rest }) => rest);
        answers = [...answers, ...newAnswers];
        
    }

    const sanitizedAnswers = answers.map(({ count, ...rest }) => rest);

    console.log("sanitizados", sanitizedAnswers)

    try {
        const response = await fetch(`${API_URL}/surveys/${id}/questions`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                questionId: questionId,
                answers: sanitizedAnswers,
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