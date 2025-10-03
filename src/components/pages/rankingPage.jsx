import './rankingPage.css'

function RankingPage() {
  const positionList = [
    {
      name: 'Erick',
      img: '/LUGAR2.png',
      size: '190px',
      num: '2°',
      score: 1000,
      img2: Array(5).fill('/images/coin_icon.png'),
      className: 'rank-second',
    },
    {
      name: 'Wynsley',
      img: 'LUGAR1.png',
      size: '210px',
      num: '1°',
      score: 1100,
      img2: Array(5).fill('/images/coin_icon.png'),
      className: 'rank-first'
    },
    {
      name: 'Luis',
      img: 'LUGAR3.png',
      num: '3°',
      size: '190px',
      score: 990,
      img2: Array(5).fill('/images/coin_icon.png'),
      className: 'rank-third'
    },
  ]

  const headeTitles=[
    {
      title:'Rank',
      className:'column__rank'
    },
    {
      title:'Nombres',
      className:'column__name'
    },
    {
      title:'Puntuación',
      className:'column__score'
    },
    {
      title:'Calificación',
      className:'column__grade'
    },

  ]

  const rankingData = [
    {
      rank: '4°',
      name: 'Yerson',
      score: 400,
      grade: Array(4).fill('/images/coin_icon.png'),
    },
    {
      rank: '5°',
      name: 'Critopher',
      score: 390,
      grade: Array(4).fill('/images/coin_icon.png'),
    },
    {
      rank: '6°',
      name: 'Lenin',
      score: 350,
      grade: Array(3).fill('/images/coin_icon.png'),
    },
    {
      rank: '7°',
      name: 'Deivy',
      score: 300,
      grade: Array(3).fill('/images/coin_icon.png'),
    },
    {
      rank: '8°',
      name: 'Carranza',
      score: 200,
      grade: Array(3).fill('/images/coin_icon.png'),
    }
  ]
  const title = 'Ranking'
  return (
    <section className='ranking'>
      <h1 className='rank__title'>{title}</h1>
      <ul className='rank__list'>
        {
          positionList.map((item, w) => {
            return (
              <li key={w} className={`list__item ${item.className}`}>
                <h2 className='top__name'>{item.name}</h2>
                <img src={item.img} width={item.size} className='img__rank' />
                <div className='contain__num'>
                  <span className='top__rank'>{item.num}</span>
                  <span className='top__score'>{item.score}</span>
                  <span className='coints'>
                    {item.img2.map((icon, j) => (
                      <img key={j} src={icon} alt="" width='15px' />
                    ))}
                  </span>
                </div>
              </li>
            )
          })
        }
      </ul>
      <table className='table'>
        <thead>
          <tr className="row__titles">
            {headeTitles.map((w, j) => (
              <th key={j} className={w.className}>{w.title}</th>
            ))}
          </tr>
      </thead>
        <tbody className='values'>
          {
            rankingData.map((item, index) => {
              return (
                <tr key={index} className='row__values'>
                  <td className='rank'>{item.rank}</td>
                  <td>{item.name}</td>
                  <td>{item.score}</td>
                  <td className='value__grade'>
                    {item.grade.map((coin, y) => (
                      <img key={y} src={coin} alt="" width='12px' className='table__coins' />
                    ))}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </section>
  )
}

export { RankingPage }