import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../connection/socket";
import "./PvP.css";
import { UserContext } from "../context/UserContext";
import Endgame from "../components/Endgame";
import { auth, updateElo } from "../firebase";
import Elo from "../elo/Elo";

const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let game = new Chess(startFen);
let playerColor;

const PvP = (props) => {
  const navigate = useNavigate();
  const [play, setPlay] = useState(false);
  const { setShowCode } = useContext(UserContext);
  const [orientation, setOrientation] = useState("white");
  const [position, setPosition] = useState(startFen);
  const [finishedGame, setFinishedGame] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [squareStyles, setSquareStyles] = useState();
  const [message, setMessage] = useState();
  useEffect(() => {
    socket.on("startGame", (data) => {
      if (data.play) {
        console.log("Game started");
        setShowCode(true);
        setPlay(true);
        setOrientation(data.orientation);
        playerColor = data.orientation[0];
      }
    });
    socket.on("newMove", (data) => {
      console.log("Move received", data.fen);
      setPosition(data.fen);
      game = new Chess(data.fen);
      setSquareStyles((prevSquareStyles) => ({
        ...highlightKingInCheck(game),
      }));
    });
    socket.on("gameOver", async (data) => {
      setSquareStyles((prevSquareStyles) => ({
        ...highlightKingInCheck(game),
      }));
      setPlay(false);
      setFinishedGame(true);
      setShowModal(true);
      game = new Chess(data.fen);
      // console.log("game over from clients and data is:", data);
      if (game.in_checkmate()) {
        if (game.turn() === "w") {
          setMessage(`Checkmate! ${data.blackPlayer} wins!`);
        } else {
          setMessage(`Checkmate! ${data.whitePlayer} wins!`);
        }
      } else if (game.in_draw()) {
        setMessage("Draw");
      } else if (game.in_stalemate()) {
        setMessage("Stalemate");
      } else if (game.in_threefold_repetition()) {
        setMessage("Threefold repetition");
      } else if (game.insufficient_material()) {
        setMessage("Insufficient material");
      }
      let score;
      if (!game.in_checkmate()) {
        score = 0;
      } else {
        if (game.turn() === "w") {
          score = -1;
        } else {
          score = 1;
        }
      }
      let player1_elo = data.whiteElo;
      let player2_elo = data.blackElo;
      console.log("Elo before game: ", player1_elo, player2_elo);
      [player1_elo, player2_elo] = Elo({
        player1_elo,
        player2_elo,
        score,
        K: 32,
      });
      console.log("Elo after game: ", player1_elo, player2_elo);
      // console.log("New Elo", newElo);
      console.log("User", auth.currentUser.uid);
      let newElo = playerColor === 'w' ? player1_elo : player2_elo;
      try {
        await updateElo(auth.currentUser.uid, newElo);
      } catch (error) {
        console.log(error);
      }
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
    console.log("current game:", game.fen(), game.game_over());
    if (game.game_over()) {
      socket.emit("gameOver", { fen: game.fen() });
    }
  };
  const highlightKingInCheck = (game) => {
    let newStyles = {},
      kingPosition = getKingPositionInCheck(game);
    // console.log("status", kingPosition, game.in_check());
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

    newStyles = { ...newStyles, ...highlightKingInCheck(game) };
    // console.log("newStyles", newStyles);
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
  const handleButtonMenu = () => {
    setShowModal(false);
    navigate("/home");
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  // console.log(squareStyles);
  return (
    <>
      {showModal && (
        <Endgame
          handleButtonMenu={handleButtonMenu}
          message={message}
          onClose={handleCloseModal}
        />
      )}
      <div
        className={`chess-container ${finishedGame ? "blur-chessboard" : ""}`}
      >
        <Chessboard
          position={position}
          onDrop={handleOnDrop}
          onMouseOverSquare={handleOnMouseOverSquare}
          squareStyles={squareStyles}
          draggable={play}
          orientation={orientation}
        ></Chessboard>
        {props.children}
      </div>
    </>
  );
};

export default PvP;
