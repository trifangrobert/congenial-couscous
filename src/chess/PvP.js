import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { useState } from "react";

const game = new Chess();

const PvP = () => {
  const [position, setPosition] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  // const [squareStyles, setSquareStyles] = useState({'e2': {backgroundColor: 'orange'}});
  const [squareStyles, setSquareStyles] = useState();
  const handleOnDrop = ({ sourceSquare, targetSquare }) => {
    console.log("handle on drop");
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    // illegal move
    if (move === null) return;
    setPosition(game.fen());
    removeHighlightSquare();
  };
  const highlightSquare = (square) => {
    let moves = game.moves({ square: square, verbose: true });
    console.log(square, moves, typeof(square));
    let newStyles = {};
    newStyles[square] = { background: "rgba(20,85,30,0.5)" };
    console.log(newStyles);
    for (let i = 0;i < moves.length;++i) {
      newStyles[moves[i].to] = {background: "radial-gradient(rgba(20,85,30,0.5) 19%, rgba(0,0,0,0) 20%)"};
    }
    console.log(newStyles);
    if (game.get(square) === null || game.get(square).color !== game.turn()) {
      newStyles = {};
    }
    setSquareStyles((prevSquareStyles) => ({
      ...newStyles
    }));
  }
  const removeHighlightSquare = () => {
    setSquareStyles({});
  }
  const handleOnSquareClick = (square) => {
    removeHighlightSquare();
    highlightSquare(square);
  };
  return (
    <div>
      <Chessboard
        position={position}
        onDrop={handleOnDrop}
        onSquareClick={handleOnSquareClick}
        squareStyles={squareStyles}
      />
    </div>
  );
};

export default PvP;
