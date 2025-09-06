import { FaArrowAltCircleDown , FaArrowAltCircleLeft , FaArrowAltCircleRight , FaArrowAltCircleUp } from "react-icons/fa";
import { TiArrowSyncOutline } from "react-icons/ti";
import './instructionsPage.css'

const controlGroups = [
  {
    className:'control__hop',
    items:[
    {
      text: 'Saltar',
      icon: <FaArrowAltCircleUp className="icon"/>,
      keyLabel:'Space'
    }
  ]
  },
  {
    className:'control__center',
    items:[
      {
        text:'Atras',
        icon:<FaArrowAltCircleLeft className="icon"/>
      },
      {
        text:'Reiniciar',
        icon:<TiArrowSyncOutline className="icon"/>
      },
      {
        text:'Adelante',
        icon:<FaArrowAltCircleRight className="icon"/>
      },
    ]
  },
  {
    className:'control_down',
    items:[
      {
        text:'Agacharse, bajar plataformas',
        icon:<FaArrowAltCircleDown className="icon"/>
      }
    ]
  }
  
]
const title = 'APOCALYPSE-le'
const description = `Level Devil es un juego de plataformas tipo troll game (parecido a Mario),
        donde el escenario cambia de forma inesperada: suelos que se caen, pinchos
        que aparecen, bloques falsos, trampas ocultas, etc. El objetivo es llegar
        hasta la puerta de salida en cada nivel, pero debes estar atento porque el
        mapa te engaña constantemente.`


function InstructionsPage() {
  return (
    <section className="game__section">
        <h1 className="game__title">{title}</h1>
        <div className="container__instrutions">
          <img src="/INSTRUCCIONES.png" alt="level decoration " className="imgs img__top" />
          <p className="game__description">{description}</p>
        </div>
        
        <div className="game__controls">
          {
            controlGroups.map((w, j)=>{
              return(
                <div key={j} className={w.className}>
                  {
                    w.items.map((d, s) =>(
                      <div key={s} className="control">
                        {d.keyLabel ? (
                          <div  className="control__hop">
                            <p>{d.text}</p>
                            <div className="contain__top">
                              {d.icon}
                              <span className="control__space">{d.keyLabel}</span>
                            </div>
                          </div>
                        ):(
                          <span className="control_down">
                          {d.icon}
                          <p>{d.text}</p>
                          </span>
                        )}
                      </div>
                    ))
                  }
                </div>
              )
            })
          }
        </div>
      <img src="/INSTRUCCIONES.png" alt="level decoration" className="imgs img__bottom" />
    </section>

  )
}

export { InstructionsPage }