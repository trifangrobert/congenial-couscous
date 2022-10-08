import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { useState, useEffect, useContext } from "react";
import { socket } from "../connection/socket";
import "./PvP.css";
import { UserContext } from "../context/UserContext";

const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let game = new Chess(startFen);
let playerColor;

const PvP = (props) => {
  const [play, setPlay] = useState(false);
  const { ingame, setIngame } = useContext(UserContext);
  const [orientation, setOrientation] = useState("white");
  const [position, setPosition] = useState(startFen);
  // const [squareStyles, setSquareStyles] = useState({'e2': {backgroundColor: 'orange'}});
  const [squareStyles, setSquareStyles] = useState();
  useEffect(() => {
    socket.on("startGame", (data) => {
      if (data.play) {
        console.log("Game started");
        setIngame(true);
        setPlay(true);
        setOrientation(data.orientation);
        playerColor = data.orientation[0];
        console.log(play);
      }
    });
    socket.on("newMove", (data) => {
      console.log("Move received", data.fen);
      setPosition(data.fen);
      game = new Chess(data.fen);
    });
    socket.on("gameOver", (data) => {
      console.log(data.message);
      setPlay(false);
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
    socket.emit("newMove", { fen: game.fen() });
    removeHighlightSquare();
    hightlightKingInCheck(game);
    setSquareStyles((prevSquareStyles) => ({
      ...hightlightKingInCheck(game),
    }));
    if (game.game_over()) {
      socket.emit("gameOver");
    }
  };
  const hightlightKingInCheck = (game) => {
    let newStyles = {},
      kingPosition = getKingPositionInCheck(game);
    console.log("status", kingPosition, game.in_check());
    if (game.in_check()) {
      newStyles[kingPosition] = {
        background:
          "radial-gradient(ellipse at center, red 0%, #e70000 25%, rgba(169,0,0,0) 89%, rgba(158,0,0,0) 100%)",
      };
    }
    return newStyles;
  };
  const highlightSquare = (square) => {
    if (game.game_over()) return;
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

    newStyles = { ...newStyles, ...hightlightKingInCheck(game) };
    console.log("newStyles", newStyles);
    setSquareStyles((prevSquareStyles) => ({
      ...newStyles,
    }));
  };
  const removeHighlightSquare = () => {
    setSquareStyles({});
  };
  const handleOnMouseOverSquare = (square) => {
    if (!ingame || game.turn() !== playerColor) {
      return;
    }
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
        draggable={play}
        orientation={orientation}
      >
      </Chessboard>
      {props.children}
    </div>
  );
};

export default PvP;
