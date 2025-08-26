import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { GamePage } from './components/pages/gamePage'
import { HomePage } from './components/pages/homePage'
import { RankingPage } from './components/pages/rankingPage'

function App() {

  return (
    <>
      <nav>
        {/* INICIO / - JUEGO /game - RANKING */}
        <Link to={'/'}>
          <h1>DEVIL LEVEL</h1>
        </Link>
        <ul>
          <li>
             <Link to={'/'}>Inicio</Link>
             <Link to={'/game'}>Juego</Link>
             <Link to={'/ranking'}>Ranking</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route exact path='/' Component={HomePage} />
        <Route exact path='/game' Component={GamePage} />
        <Route exact path='/ranking' Component={RankingPage} />
      </Routes>

    </>
  )
}

export default App
