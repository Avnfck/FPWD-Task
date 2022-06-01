const { readFile, writeFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async (questionId) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const question = JSON.parse(fileContent).find(q => q.id == questionId)

    return question
  }

  const addQuestion = async (question) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const newQuestions = await JSON.parse(fileContent).concat(question);
    await writeFile(fileName, JSON.stringify(newQuestions))

    return newQuestions
  }

  const getAnswers = async (questionId) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const answers = JSON.parse(fileContent).find(el => el.id == questionId).answers

    return answers
  }

  const getAnswer = async (questionId, answerId) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const answer = JSON.parse(fileContent).find(el => el.id == questionId).answers.find(an => an.id == answerId)

    return answer
  }
  
  // ZAMIENIC W QUESTION INDEX NA CONTENT JSON
  const addAnswer = async (questionId, answer) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const contentJson = await JSON.parse(fileContent)
    const questionIndex = await JSON.parse(fileContent).findIndex(q => q.id == questionId)
    await contentJson[questionIndex].answers.push(answer)
    await writeFile(fileName, JSON.stringify(contentJson))

    return contentJson
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
