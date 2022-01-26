import React, { ElementRef, RefObject, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

const CROSS_CLASS: string = "cross";
const CIRCLE_CLASS: string = "circle";
const WINNING_COMBINATIONS: Array<Array<number>> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
const App: React.FC = () => {

  const cellRef = useRef<HTMLDivElement>(null);
  let circleTurn: boolean = false;
  let cellElement: NodeListOf<Element>;
  let winningMessageTextElement: HTMLElement;
  let winningMessageElement: HTMLElement;
  let board: HTMLElement;
  let restartButton: HTMLElement;

  useEffect(() => {
    cellElement = document.querySelectorAll('[data-cell]');
    board = document.getElementById('board')!;
    restartButton = document.getElementById('restartButton')!;
    winningMessageTextElement = document.querySelector('[data-winning-message-text]')!;
    winningMessageElement = document.getElementById("winning-message")!;
    cellElement.forEach(cell => {
      cell.classList.remove(CROSS_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
      cell.removeEventListener('click', handleUserClick);
      cell.addEventListener('click', handleUserClick, { once: true })
    })
    setBoardHoverClass();
    restartButton.addEventListener('click', startGame);
    winningMessageElement.classList.remove('show');
  }, [])

  function startGame() {
    window.location.reload();
  }
  function handleUserClick(e: Event): void {
    const targetCell = (e.target as HTMLElement);
    const currentClass = circleTurn ? CIRCLE_CLASS : CROSS_CLASS;
    placeMarker(targetCell, currentClass);
    if (checkWinner(currentClass)) {
      endGame(false)
    } else if (isDraw()) {
      endGame(true)
    }
    else {
      swapTurns();
      setBoardHoverClass();
    }
  }

  function isDraw(): boolean {
    return Array.from(cellElement).every(cell => {
      return cell.classList.contains(CROSS_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    })
  }

  function setBoardHoverClass(): void {
    board.classList.remove(CROSS_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
      board.classList.add(CIRCLE_CLASS)
    } else {
      board.classList.add(CROSS_CLASS)
    }
  }

  function swapTurns() {
    circleTurn = !circleTurn;
  }

  function endGame(draw: boolean): void {
    if (draw) {
      winningMessageTextElement.innerText = 'Draw!';
    } else {
      winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
    }
    winningMessageElement.classList.add('show');
  }

  function placeMarker(target: HTMLElement, currentClass: string): void {
    target.classList.add(currentClass);
  }

  function checkWinner(currentClass: string): boolean {
    return WINNING_COMBINATIONS.some(
      combination => {
        return combination.every(index => {
          return cellElement[index].classList.contains(currentClass);
        })
      }
    )
  }
  const cell: any[] =[];
  for (let i = 0; i < 9; i++) {
    cell.push(<div className="cell" key={i} data-cell ></div>)
  }

  return (
    <>
      <div className="board cross" id="board">
        {cell}
      </div>
      <div className="winning-message" id="winning-message">
        <div data-winning-message-text></div>
        <button id="restartButton">Restart</button>
      </div>
    </>
  );
}

export default App;
