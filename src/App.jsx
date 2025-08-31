import './App.css'
import { Route, Routes } from 'react-router-dom'
import { GamePage } from './components/pages/gamePage'
import { RankingPage } from './components/pages/rankingPage'
import { InstructionsPage } from './components/pages/instructionsPage'
import { Navbar } from './components/organisms/navbar'
import { HomePage } from './components/pages/homePage'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path='/' Component={HomePage} />
        <Route exact path='/instructions' Component={InstructionsPage} />
        <Route exact path='/game' Component={GamePage} />
        <Route exact path='/ranking' Component={RankingPage} />
      </Routes>

    </>
  )
}

export default App
