import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { useEffect } from "react";
import { useState } from "react";
import { socket } from "../connection/socket";
import "./PvP.css";

const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let game = new Chess(startFen);
let playerColor;

const PvP = () => {
  const [play, setPlay] = useState(false);
  const [orientation, setOrientation] = useState("white");
  const [position, setPosition] = useState(startFen);
  // const [squareStyles, setSquareStyles] = useState({'e2': {backgroundColor: 'orange'}});
  const [squareStyles, setSquareStyles] = useState();
  useEffect(() => {
    socket.on("startGame", (data) => {
      if (data.play) {
        console.log("Game started");
        setPlay(true);
        setOrientation(data.orientation);
        playerColor = data.orientation[0];
        console.log(playerColor);
      }
    }); 
    socket.on("newMove", (data) => {
      console.log("Move received", data.fen);
      setPosition(data.fen);
      game = new Chess(data.fen);
    });
  }, [socket]);
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
    
    if (game.turn() !== playerColor) {
      console.log("Not your turn");
      return;
    }
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    // illegal move
    if (move === null) return;
    setPosition(game.fen());
    socket.emit("newMove", {fen: game.fen()});
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
    }
    setSquareStyles((prevSquareStyles) => ({
      ...newStyles,
    }));
  };
  const removeHighlightSquare = () => {
    setSquareStyles({});
  };
  const handleOnMouseOverSquare = (square) => {
    if (!play || game.turn() !== playerColor) {
      return;
    }
    removeHighlightSquare();
    highlightSquare(square);
  };
  return (
    <div className="chess-container">
      {position}
      <Chessboard
        position={position}
        onDrop={handleOnDrop}
        onMouseOverSquare={handleOnMouseOverSquare}
        squareStyles={squareStyles}
        draggable={play}
        orientation={orientation}
      />
    </div>
  );
};

export default PvP;
