import './gamePage.css'

function GamePage() {
  const gameTitle = "APOCALYPSE-le"

  return (
    <section className='game__section'>
      <img src="./INSTRUCCIONES.png" alt="game top" className="img__game top" />
      <div className='container_game'>
        <h2 className='game__title'>{gameTitle}</h2>
        <div className="container__Eye">
          <img src="/JUEGO.png" alt="Eye left" className="img__eye left"/>
          <img src="/JUEGO.png" alt="Eye right" className="img__eye right"/>
        </div>
        <a href='#' className="button__game">Jugar</a>
      </div>
      <img src="./INSTRUCCIONES.png" alt="game below" className="img__game below" />
    </section>
  )
}

export { GamePage }