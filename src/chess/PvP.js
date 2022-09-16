import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { useState } from "react";
import "./PvP.css";

const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const game = new Chess(startFen);

const PvP = () => {
  const [position, setPosition] = useState(startFen);
  // const [squareStyles, setSquareStyles] = useState({'e2': {backgroundColor: 'orange'}});
  const [squareStyles, setSquareStyles] = useState();
  const getKingPositionInCheck = (game) => {
    let kingPosition;
    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        let piece = game.board()[i][j];
        if (
          piece !== null &&
          piece.type === "k" &&
          piece.color === game.turn()
        ) {
          kingPosition = piece.square;
        }
      }
    }
    // console.log(kingPosition);
    return kingPosition;
  };
  const handleOnDrop = ({ sourceSquare, targetSquare }) => {
    // console.log("handle on drop");
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    // illegal move
    if (move === null) return;
    setPosition(game.fen());
    removeHighlightSquare();
    if (game.game_over()) {
      console.log("game over!");
    }
  };
  const highlightSquare = (square) => {
    let moves = game.moves({ square: square, verbose: true });
    // console.log(square, moves, typeof(square));
    let newStyles = {};
    newStyles[square] = { background: "rgba(20,85,30,0.5)" };
    // console.log(newStyles);
    for (let i = 0; i < moves.length; ++i) {
      newStyles[moves[i].to] = {
        background:
          "radial-gradient(rgba(20,85,30,0.5) 19%, rgba(0,0,0,0) 20%)",
      };
    }
    // console.log(newStyles);
    // radial-gradient(ellipse at center, red 0%, #e70000 25%, rgba(169,0,0,0) 89%, rgba(158,0,0,0) 100%); css for check
    if (game.get(square) === null || game.get(square).color !== game.turn()) {
      newStyles = {};
    }
    let kingPosition = getKingPositionInCheck(game);
    if (game.in_check()) {
      newStyles[kingPosition] = {
        background:
          "radial-gradient(ellipse at center, red 0%, #e70000 25%, rgba(169,0,0,0) 89%, rgba(158,0,0,0) 100%)",
      };
      // newStyles[kingPosition] = {background: "red"}
    }
    setSquareStyles((prevSquareStyles) => ({
      ...newStyles,
    }));
  };
  const removeHighlightSquare = () => {
    setSquareStyles({});
  };
  const handleOnMouseOverSquare = (square) => {
    removeHighlightSquare();
    highlightSquare(square);
  };
  return (
    <div className="chess-container">
      <Chessboard
        position={position}
        onDrop={handleOnDrop}
        onMouseOverSquare={handleOnMouseOverSquare}
        squareStyles={squareStyles}
      />
    </div>
  );
};

export default PvP;
