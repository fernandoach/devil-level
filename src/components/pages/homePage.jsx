import './homePage.css'

function HomePage(){

  const homeTitle= 'IPCACI'
  return(
    <section className='home__section'>
      <div className='contain-title'>
        <h2 className='home__title'>{homeTitle}</h2>
      </div>    
      <p className='home__paragraph'>Studio</p>
    </section>
  )
}

export { HomePage }