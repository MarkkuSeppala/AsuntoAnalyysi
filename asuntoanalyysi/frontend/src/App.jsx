import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setError('')
    } else {
      setFile(null)
      setFileName('')
      setError('Valitse PDF-tiedosto')
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setFileName(droppedFile.name)
      setError('')
    } else {
      setFile(null)
      setFileName('')
      setError('Valitse PDF-tiedosto')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Valitse PDF-tiedosto ensin')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setAnalysis('')

    // Tarkistetaan ensin onko backend-palvelin käynnissä
    try {
      const testResponse = await axios.get(`${API_URL}/test`)
      console.log('Backend-palvelin vastasi:', testResponse.data)
      
      // Jos palvelin vastaa, lähetetään varsinainen analyysi-pyyntö
      const formData = new FormData()
      formData.append('pdfFile', file)

      try {
        const response = await axios.post(`${API_URL}/analyze`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        setAnalysis(response.data.analysis)
      } catch (analyzeErr) {
        console.error('Virhe analysoinnissa:', analyzeErr)
        setError(
          analyzeErr.response?.data?.error || 
          analyzeErr.response?.data?.details ||
          'Analyysin luominen epäonnistui. Tarkista, että PDF-tiedosto on kelvollinen.'
        )
      }
    } catch (connectionErr) {
      console.error('Virhe yhteydessä backend-palvelimeen:', connectionErr)
      setError('Yhteyttä backend-palvelimeen ei saatu. Tarkista, että palvelin on käynnissä.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>AsuntoAnalyysi</h1>
          <p className="header-subtitle">
            Tekoälyavusteinen työkalu asuntojen myynti-ilmoitusten analysointiin
          </p>
        </div>
      </header>

      <main className="container main">
        <div className="grid">
          <div className="sidebar">
            <div className="card">
              <h2>Lataa asuntoilmoitus</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Valitse PDF-tiedosto
                  </label>
                  <div 
                    className={`file-upload ${isDragging ? 'dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <label className="file-upload-label">
                      <div className="file-upload-content">
                        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="file-name">
                          {fileName || 'Raahaa tiedosto tähän tai klikkaa selausta'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden-input"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!file || isAnalyzing}
                  className="submit-button"
                >
                  {isAnalyzing ? 'Analysoidaan...' : 'Analysoi ilmoitus'}
                </button>
              </form>
            </div>

            <div className="card instruction-card">
              <h2>Ohje</h2>
              <p className="instruction-text">
                1. Lataa asuntoilmoituksen PDF-tiedosto.
              </p>
              <p className="instruction-text">
                2. Klikkaa "Analysoi ilmoitus" -painiketta.
              </p>
              <p className="instruction-text">
                3. Analyysi ilmestyy oikealle puolelle kun se on valmis.
              </p>
            </div>
          </div>

          <div className="content">
            <div className="card analysis-card">
              <h2>Analyysi</h2>
              
              {isAnalyzing ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p className="loading-text">Asuntoilmoitusta analysoidaan...</p>
                </div>
              ) : analysis ? (
                <div className="analysis-content">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              ) : (
                <div className="empty-container">
                  <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="empty-text">Lataa asuntoilmoitus saadaksesi asiantuntija-analyysin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            &copy; {new Date().getFullYear()} AsuntoAnalyysi - Tekoälyavusteinen työkalu asuntoilmoitusten analysointiin
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
