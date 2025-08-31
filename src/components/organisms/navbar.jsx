import { Link } from "react-router-dom";
import "./navbar.css";
import { FaBook, FaGamepad, FaRankingStar } from "react-icons/fa6";

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
        <h1>DEVIL LEVEL</h1>
      </Link>
      <ul>
        {
          menu.map((item) => {
            return(
              <li>
                <Link to={item.href}>
                  {item.icon}
                  <span>{item.text}</span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </nav>
  );
}

export { Navbar };
