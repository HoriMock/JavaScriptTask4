"use strict";

// クイズデータのURL
const API_URL = "https://opentdb.com/api.php?amount=10";

// DOM
const titleId = document.getElementById("title");
const genreId = document.getElementById("genre");
const difficultyId = document.getElementById("difficulty");
const questionId = document.getElementById("question");
const startButton = document.getElementById("start-quiz");
const answerButtons = document.getElementById("answers");
const home = document.getElementById("home");
class Quiz {
  constructor(quizData) {
    this.quizzes = quizData.results;
    this.correctAnswerNum = 0;
  }
  // ジャンルを取得するメソッド
  getQuizCategory(index) {
    return this.quizzes[index - 1].category;
  }
  // 難易度を取得するメソッド
  getQuizDifficulty(index) {
    return this.quizzes[index - 1].difficulty;
  }
  // クイズの設問を取得するメソッド
  getQuizQuestion(index) {
    return this.quizzes[index - 1].question;
  }
  // クイズの総数を取得するメソッド
  getQuizTotal() {
    return this.quizzes.length;
  }
  // クイズの正答を取得するメソッド
  getCorrectAnswer(index) {
    return this.quizzes[index - 1].correct_answer;
  }
  // クイズの誤答を取得するメソッド
  getIncorrectAnswers(index) {
    return this.quizzes[index - 1].incorrect_answers;
  }
  // クイズの正答数をカウントするメソッド
  countCorrectAnswerNum(index, shuffleAnswer) {
    const correctAnswer = this.quizzes[index - 1].correct_answer;
    if (shuffleAnswer === correctAnswer) {
      return this.correctAnswerNum++;
    }
  }
  // クイズの正答数を返すメソッド
  getCorrectAnswersNum() {
    return this.correctAnswerNum;
  }
}
// クイズデータをフェッチする関数
const fetchQuizData = async (index) => {
  titleId.textContent = "取得中";
  questionId.textContent = "少々お待ち下さい";

  const response = await fetch(API_URL);
  const data = await response.json();
  // Quizクラスをインスタンス化
  const quizInstance = new Quiz(data);

  setNextQuiz(quizInstance, index);
};

// 開始ボタンのイベント
startButton.addEventListener("click", () => {
  startButton.hidden = true;
  const quizNum = 1;
  fetchQuizData(quizNum);
});

// クイズを表示する関数
const showQuiz = (quizInstance, index) => {
  titleId.textContent = `問題${index}`;
  genreId.innerHTML = `<strong>[ジャンル] ${quizInstance.getQuizCategory(
    index
  )}</strong>`;
  difficultyId.innerHTML = `<strong>[難易度] ${quizInstance.getQuizDifficulty(
    index
  )}</strong>`;
  questionId.textContent = `${quizInstance.getQuizQuestion(index)}`;
  // 正答と誤答を配列に格納
  const answers = [
    quizInstance.getCorrectAnswer(index),
    ...quizInstance.getIncorrectAnswers(index),
  ];
  // 答えの配列をシャッフル
  const shuffleAnswers = shuffle(answers);
  // 答えのボタンを作成
  shuffleAnswers.forEach((shuffleAnswer) => {
    const liElement = document.createElement("li");
    liElement.style.listStyle = "none";
    answerButtons.appendChild(liElement);

    const buttonElement = document.createElement("button");
    buttonElement.innerHTML = shuffleAnswer;
    liElement.appendChild(buttonElement);
    // いずれかの答えをクリックした時のイベント
    buttonElement.addEventListener("click", () => {
      quizInstance.countCorrectAnswerNum(index, shuffleAnswer);
      index++;
      setNextQuiz(quizInstance, index);
    });
  });
};

// 正答と誤答をシャッフルする関数
const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// クイズを終了させる関数
const finishQuiz = (quizInstance) => {
  titleId.textContent = `あなたの正答数は${quizInstance.getCorrectAnswersNum()}です！！`;
  genreId.textContent = "";
  difficultyId.textContent = "";
  questionId.textContent = "再度チャレンジしたい場合は以下をクリック！！";

  const homeButton = document.createElement("button");
  homeButton.textContent = "ホームに戻る";
  home.appendChild(homeButton);

  // ホームへ戻るボタンをクリックした時のイベント
  home.addEventListener("click", () => {
    location.reload();
  });
};

// 次のクイズをセットする関数
const setNextQuiz = (quizInstance, index) => {
  // 最初の子ノードがあれば削除する
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  if (index <= quizInstance.getQuizTotal()) {
    showQuiz(quizInstance, index);
  } else {
    finishQuiz(quizInstance);
  }
};
