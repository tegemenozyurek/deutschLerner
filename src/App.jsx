import { useState } from 'react'
import './App.css'
import wörterA1_1 from './data/wörterA1_1.json'
import wörterA1_2 from './data/wörterA1_2.json'
import verbenA1_1 from './data/verbenA1_1.json'
import verbenA1_2 from './data/verbenA1_2.json'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)
  const [words, setWords] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const levels = ['A1.1', 'A1.2', 'A2.1', 'A2.2']

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSelectedLevel(null)
    setSelectedMode(null)
  }

  const handleBack = () => {
    if (selectedMode) {
      setSelectedMode(null)
    } else if (selectedLevel) {
      setSelectedLevel(null)
    } else {
      setSelectedCategory(null)
    }
  }

  const handleLevelSelect = (level) => {
    setSelectedLevel(level)
    // Verben kategorisi için direkt test başlat
    if (selectedCategory === 'Verben') {
      initializeVerbenTest(level)
    }
  }

  const handleModeSelect = (mode) => {
    setSelectedMode(mode)
    if (mode === 'Artikel' || mode === 'Turkisch-Deutsch') {
      initializeTest()
    }
  }

  const initializeTest = () => {
    // Seviyeye göre doğru JSON dosyasını seç
    let allWords = []
    if (selectedLevel === 'A1.1') {
      allWords = wörterA1_1
    } else if (selectedLevel === 'A1.2') {
      allWords = wörterA1_2
    } else {
      // A2.1 ve A2.2 için henüz veri yok
      alert(`${selectedLevel} seviyesi için henüz veri bulunmamaktadır.`)
      return
    }

    if (allWords.length === 0) {
      alert('Bu seviye için kelime bulunamadı.')
      return
    }

    // Fisher-Yates shuffle algoritması ile rastgele karıştır
    const shuffled = [...allWords]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    // Rastgele 10 kelime seç (tüm JSON'dan)
    const selectedWords = shuffled.slice(0, 10)
    setWords(selectedWords)
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTestCompleted(false)
    setShowTranslation(false)
  }

  const initializeVerbenTest = (level) => {
    // Seviyeye göre doğru Verben JSON dosyasını seç
    let allVerbs = []
    if (level === 'A1.1') {
      allVerbs = verbenA1_1
    } else if (level === 'A1.2') {
      allVerbs = verbenA1_2
    } else {
      // A2.1 ve A2.2 için henüz veri yok
      alert(`${level} seviyesi için henüz veri bulunmamaktadır.`)
      return
    }

    if (allVerbs.length === 0) {
      alert('Bu seviye için fiil bulunamadı.')
      return
    }

    // Fisher-Yates shuffle algoritması ile rastgele karıştır
    const shuffled = [...allVerbs]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    // Rastgele 10 fiil seç (tüm JSON'dan)
    const selectedVerbs = shuffled.slice(0, 10)
    setWords(selectedVerbs)
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTestCompleted(false)
    setShowTranslation(false)
  }

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
    const currentWord = words[currentQuestionIndex]
    if (answer === currentWord.artikel) {
      setScore(prevScore => prevScore + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < words.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setShowTranslation(false)
    } else {
      setTestCompleted(true)
    }
  }

  const handleShowTranslation = () => {
    setShowTranslation(true)
  }

  const handleRestart = () => {
    if (selectedCategory === 'Verben') {
      initializeVerbenTest(selectedLevel)
    } else {
      initializeTest()
    }
  }

  // Verben test sayfası
  if (selectedCategory === 'Verben' && selectedLevel && words.length > 0) {
    if (testCompleted) {
      return (
        <div className="app">
          <div className="container">
            <div className="test-result">
              <h2 className="result-title">Test Tamamlandı!</h2>
              <div className="score-display">
                <p className="score-text">Skor: {score} / {words.length}</p>
                <p className="score-percentage">{Math.round((score / words.length) * 100)}%</p>
              </div>
              <button className="restart-button" onClick={handleRestart}>
                Tekrar Başla
              </button>
              <button className="back-button" onClick={() => {
                setSelectedLevel(null)
                setWords([])
                setTestCompleted(false)
              }}>
                ← Geri
              </button>
            </div>
          </div>
        </div>
      )
    }

    const currentVerb = words[currentQuestionIndex]
    const progressPercentage = ((currentQuestionIndex + 1) / words.length) * 100

    return (
      <div className="app">
        <div className="container">
          <div className="test-container">
            <div className="test-header">
              <button className="back-button" onClick={() => {
                setSelectedLevel(null)
                setWords([])
                setTestCompleted(false)
              }}>
                ← Geri
              </button>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="question-counter">
                Soru {currentQuestionIndex + 1} / {words.length}
              </p>
            </div>

            <div className="question-container">
              <h2 className="question-word">{currentVerb.verb}</h2>
              
              {!showTranslation && (
                <button 
                  className="translation-button" 
                  onClick={handleShowTranslation}
                >
                  Antwort
                </button>
              )}

              {showTranslation && (
                <div className="translation-display">
                  <p className="translation-text-large">{currentVerb.Türkisch}</p>
                  <p className="example-text">{currentVerb.Beispiel}</p>
                </div>
              )}

              {showTranslation && (
                <button className="next-button" onClick={handleNextQuestion}>
                  {currentQuestionIndex < words.length - 1 ? 'Sonraki Soru →' : 'Sonuçları Gör'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Turkisch-Deutsch test sayfası
  if (selectedCategory === 'Namen' && selectedLevel && selectedMode === 'Turkisch-Deutsch' && words.length > 0) {
    if (testCompleted) {
      return (
        <div className="app">
          <div className="container">
            <div className="test-result">
              <h2 className="result-title">Test Tamamlandı!</h2>
              <div className="score-display">
                <p className="score-text">Skor: {score} / {words.length}</p>
                <p className="score-percentage">{Math.round((score / words.length) * 100)}%</p>
              </div>
              <button className="restart-button" onClick={handleRestart}>
                Tekrar Başla
              </button>
              <button className="back-button" onClick={() => {
                setSelectedMode(null)
                setWords([])
                setTestCompleted(false)
              }}>
                ← Geri
              </button>
            </div>
          </div>
        </div>
      )
    }

    const currentWord = words[currentQuestionIndex]
    const progressPercentage = ((currentQuestionIndex + 1) / words.length) * 100

  return (
      <div className="app">
        <div className="container">
          <div className="test-container">
            <div className="test-header">
              <button className="back-button" onClick={() => {
                setSelectedMode(null)
                setWords([])
                setTestCompleted(false)
              }}>
                ← Geri
              </button>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="question-counter">
                Soru {currentQuestionIndex + 1} / {words.length}
              </p>
            </div>

            <div className="question-container">
              <h2 className="question-word">{currentWord.artikel} {currentWord.Wort}</h2>
              
              {!showTranslation && (
                <button 
                  className="translation-button" 
                  onClick={handleShowTranslation}
                >
                  Antwort
                </button>
              )}

              {showTranslation && (
                <div className="translation-display">
                  <p className="translation-text-large">{currentWord.Türkisch}</p>
                  <p className="example-text">{currentWord.Beispiel}</p>
                </div>
              )}

              {showTranslation && (
                <button className="next-button" onClick={handleNextQuestion}>
                  {currentQuestionIndex < words.length - 1 ? 'Sonraki Soru →' : 'Sonuçları Gör'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Artikel test sayfası
  if (selectedCategory === 'Namen' && selectedLevel && selectedMode === 'Artikel' && words.length > 0) {
    if (testCompleted) {
      return (
        <div className="app">
          <div className="container">
            <div className="test-result">
              <h2 className="result-title">Test Tamamlandı!</h2>
              <div className="score-display">
                <p className="score-text">Skor: {score} / {words.length}</p>
                <p className="score-percentage">{Math.round((score / words.length) * 100)}%</p>
              </div>
              <button className="restart-button" onClick={handleRestart}>
                Tekrar Başla
              </button>
              <button className="back-button" onClick={() => {
                setSelectedMode(null)
                setWords([])
                setTestCompleted(false)
              }}>
                ← Geri
              </button>
            </div>
          </div>
        </div>
      )
    }

    const currentWord = words[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentWord.artikel
    const artikelOptions = ['der', 'die', 'das']
    const progressPercentage = ((currentQuestionIndex + 1) / words.length) * 100

    return (
      <div className="app">
        <div className="container">
          <div className="test-container">
            <div className="test-header">
              <button className="back-button" onClick={() => {
                setSelectedMode(null)
                setWords([])
                setTestCompleted(false)
              }}>
                ← Geri
        </button>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="question-counter">
                Soru {currentQuestionIndex + 1} / {words.length}
              </p>
            </div>

            <div className="question-container">
              <h2 className="question-word">{currentWord.Wort}</h2>
              <p className="question-instruction">Doğru artikel'i seçin:</p>
              
              <div className="answer-options">
                {artikelOptions.map((artikel) => {
                  let buttonClass = 'answer-button'
                  if (selectedAnswer === artikel) {
                    buttonClass += isCorrect ? ' correct' : ' incorrect'
                  }
                  if (selectedAnswer && currentWord.artikel === artikel) {
                    buttonClass += ' correct-answer'
                  }
                  return (
                    <button
                      key={artikel}
                      className={buttonClass}
                      onClick={() => !selectedAnswer && handleAnswerSelect(artikel)}
                      disabled={!!selectedAnswer}
                    >
                      {artikel}
                    </button>
                  )
                })}
              </div>

              {selectedAnswer && (
                <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
                  <p>{isCorrect ? '✓ Doğru!' : `✗ Yanlış! Doğru cevap: ${currentWord.artikel}`}</p>
                  <p className="translation-text">Türkçe: {currentWord.Türkisch}</p>
                  <p className="example-text">{currentWord.Beispiel}</p>
                </div>
              )}

              {selectedAnswer && (
                <button className="next-button" onClick={handleNextQuestion}>
                  {currentQuestionIndex < words.length - 1 ? 'Sonraki Soru →' : 'Sonuçları Gör'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mode seçim sayfası (sadece Namen için)
  if (selectedCategory === 'Namen' && selectedLevel && !selectedMode) {
    return (
      <div className="app">
        <div className="container">
          <button className="back-button" onClick={handleBack}>
            ← Geri
          </button>
          <h2 className="level-title">{selectedCategory} - {selectedLevel}</h2>
          <div className="modes-grid">
            <button
              className="mode-button artikel"
              onClick={() => handleModeSelect('Artikel')}
            >
              <span className="button-icon">🔤</span>
              <span className="button-text">Artikel</span>
            </button>
            <button
              className="mode-button turkisch-deutsch"
              onClick={() => handleModeSelect('Turkisch-Deutsch')}
            >
              <span className="button-icon">🔄</span>
              <span className="button-text">Turkisch-Deutsch</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Seviye seçim sayfası
  if (selectedCategory && !selectedLevel) {
    return (
      <div className="app">
        <div className="container">
          <button className="back-button" onClick={handleBack}>
            ← Geri
          </button>
          <h2 className="level-title">{selectedCategory}</h2>
          <div className="levels-grid">
            {levels.map((level) => (
              <button
                key={level}
                className="level-button"
                onClick={() => handleLevelSelect(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="main-title">Deutsch Lerner</h1>
          <p className="subtitle">Almanca öğrenmeye başlayın</p>
        </div>
        <div className="categories">
          <button
            className="category-button verben"
            onClick={() => handleCategorySelect('Verben')}
          >
            <span className="button-icon">📚</span>
            <span className="button-text">Verben</span>
          </button>
          <button
            className="category-button namen"
            onClick={() => handleCategorySelect('Namen')}
          >
            <span className="button-icon">📖</span>
            <span className="button-text">Namen</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
