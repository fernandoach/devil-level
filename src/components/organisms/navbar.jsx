import { Link } from "react-router-dom";
import "./navbar.css";
import { FaBook, FaGamepad, FaRankingStar } from "react-icons/fa6";
import Img from '../../../public/PARTICLE.png'


function Navbar() {
  const menu = [
    {
      href: '/instructions',
      text: 'Instrucciones',
      icon: <FaBook size={30} />
    },
    {
      href: '/game',
      text: 'Juego',
      icon: <FaGamepad size={30} />
    },
    {
      href: '/ranking',
      text: 'Ranking',
      icon: <FaRankingStar size={30} />
    },
  ]

  return (
    <nav className="navbar">
      <Link to={"/"} className="navbar__home-link">
        <h1 className="navbar__title">APOCALYPSE-le</h1>
      </Link>
      <ul className="navbar__menu">
        {
          menu.map((item) => {
            return(
              <li className="navbar__item">
                <Link className="navbar__link" to={item.href}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </Link>
              </li>
            )
          })
        }
      </ul>
      <img src={Img} alt="img-decoration" width='320px' />
    </nav>
  );
}

export { Navbar };
