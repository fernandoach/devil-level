"use client";
import { useEffect, useState } from "react";
import "./rankingPage.css";

function RankingPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const list = await response.json();
        setData(list);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Configuración para top 3
  const topConfig = [
    { img: "/LUGAR2.png", size: "190px", num: "2°", className: "rank-second" },
    { img: "LUGAR1.png", size: "210px", num: "1°", className: "rank-first" },
    { img: "LUGAR3.png", size: "190px", num: "3°", className: "rank-third" },
  ];

  // Top 3 dinámicos
  const positionList = data.slice(0, 3).map((item, index) => ({
    name: item.nickname,
    img: topConfig[index].img,
    size: topConfig[index].size,
    num: topConfig[index].num,
    score: item.score,
    deaths: item.deaths,
    img2: Array(Math.min(Math.floor(item.score / 100), 5)).fill(
      "/images/coin_icon.png"
    ),
    className: topConfig[index].className,
  }));

  // Resto del ranking dinámico
  const rankingData = data.slice(3).map((item, index) => ({
    rank: `${index + 4}°`,
    name: item.nickname,
    score: item.score,
    deaths: item.deaths,
    grade: Array(Math.min(Math.floor(item.score / 100), 5)).fill(
      "/images/coin_icon.png"
    ),
  }));

  const headeTitles = [
    { title: "Rank", className: "column__rank" },
    { title: "Nombres", className: "column__name" },
    { title: "Puntuación", className: "column__score" },
    { title: "Muertes", className: "column__deaths" }, // 👈 Nueva columna
  ];

  const title = "Ranking";

  return (
    <section className="ranking">
      <h1 className="rank__title">{title}</h1>
      {data.length === 0 ? (
        <h2 className="titles">Aun no hay registros del ranking</h2>
      ) : (
        <>
          <ul className="rank__list">
            {positionList.map((item, w) => {
              return (
                <li key={w} className={`list__item ${item.className}`}>
                  <h2 className="top__name">{item.name}</h2>
                  <img src={item.img} width={item.size} className="img__rank" />
                  <div className="contain__num">
                    <span className="top__rank">{item.num}</span>
                    <span className="top__score">{item.score} pts</span>
                    <span className="top__deaths">☠ {item.deaths}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <table className="table">
            <thead>
              <tr className="row__titles">
                {headeTitles.map((w, j) => (
                  <th key={j} className={w.className}>
                    {w.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="values">
              {rankingData.map((item, index) => {
                return (
                  <tr key={index} className="row__values">
                    <td className="rank">{item.rank}</td>
                    <td>{item.name}</td>
                    <td>{item.score}</td>
                    <td>{item.deaths}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

export { RankingPage };
