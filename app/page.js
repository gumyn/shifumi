// app/(home)/page.js
'use client';

import { useState, useEffect } from 'react';
import './globals.css';

const choices = ["pierre", "papier", "ciseaux"];
const emojis = {
  pierre: "✊",
  papier: "✋",
  ciseaux: "✌️"
};

const getWinner = (choice1, choice2) => {
  if (choice1 === choice2) return -1; // match nul
  if (
    (choice1 === 'pierre' && choice2 === 'ciseaux') ||
    (choice1 === 'papier' && choice2 === 'pierre') ||
    (choice1 === 'ciseaux' && choice2 === 'papier')
  ) {
    return 0; // le premier joueur gagne
  }
  return 1; // le second joueur gagne
};

const playMatches = (choices) => {
  const numPlayers = choices.length;
  const results = Array(numPlayers).fill(0);

  for (let i = 0; i < numPlayers; i++) {
    const leftIndex = (i - 1 + numPlayers) % numPlayers;
    const rightIndex = (i + 1) % numPlayers;

    // Jouer contre le joueur à gauche
    const leftResult = getWinner(choices[i], choices[leftIndex]);
    if (leftResult === 0) {
      results[i] += 1;
    } else if (leftResult === 1) {
      results[leftIndex] += 1;
    }

    // Jouer contre le joueur à droite
    const rightResult = getWinner(choices[i], choices[rightIndex]);
    if (rightResult === 0) {
      results[i] += 1;
    } else if (rightResult === 1) {
      results[rightIndex] += 1;
    }
  }

  return results;
};

export default function Home() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [choices, setChoices] = useState(Array(numPlayers).fill(''));
  const [scores, setScores] = useState(Array(numPlayers).fill(0));
  const [round, setRound] = useState(1);

  const handleChoice = (playerIndex, choice) => {
    const newChoices = [...choices];
    newChoices[playerIndex] = choice;
    setChoices(newChoices);
  };

  const handlePlay = () => {
    const results = playMatches(choices);
    const newScores = [...scores];
    results.forEach((result, index) => {
      newScores[index] += result;
    });
    setScores(newScores);
    if (newScores.some(score => score >= 10)) {
      const winnerIndex = newScores.findIndex(score => score >= 10);
      alert(`Le joueur ${winnerIndex + 1} a gagné!`);
      setScores(Array(numPlayers).fill(0));
    }
    setChoices(Array(numPlayers).fill(''));
    setRound(round + 1);
  };

  useEffect(() => {
    if (choices.every(choice => choice)) {
      handlePlay();
    }

    // console.log(choices)
    // console.log(scores)
  }, [choices]);

  return (
    <div>
      <label className="centered-div">
        <h1>Jeu de Shifumi Multi-joueurs</h1>
        Nombre de joueurs:
        {["2", "3", "4"].map(option => (
          <button key={option} onClick={(e) => {
            const num = parseInt(e.target.textContent);
            setNumPlayers(num);
            setChoices(Array(num).fill(''));
            setScores(Array(num).fill(0));
            // console.log(num)
          }}>
            {option}
          </button>
        ))}
      </label>

      <div className="players">

        
        {choices.map((choice, index) => (
          <div key={index} className={`player player-${index + 1}`}>
            <h2>Joueur {index + 1}</h2>
            <p>Score: {scores[index]}</p>
            
            {choices[index] ? ( <div><button>{emojis[choices[index]]}</button></div> ) : (
              <div>
                {["pierre", "papier", "ciseaux"].map(option => (
                  <button key={option} onClick={() => handleChoice(index, option)}>
                    {emojis[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}


      </div>
    </div>
  );
}
