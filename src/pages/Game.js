import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import PvP from "../chess/PvP";
import JoinLink from "../components/JoinLink";
import { UserContext } from "../context/UserContext";
import { socket } from "../connection/socket";
import "./Game.css";

const Game = () => {
  const { gameid } = useParams();
  const { ingame } = useContext(UserContext);
  const [opponentName, setOpponentName] = useState("");
  const [userName, setUserName] = useState("");
  useEffect(() => {
    socket.on("startGame", (data) => {
      setOpponentName(data.opponentName);
      setUserName(data.userName);
    });
  }, [socket]);
  return (
    <>
      <PvP>
        <div className="user-data">{userName} (1500)</div>
        <div className="opponent-data">{opponentName} (1400)</div>
      </PvP>
      {!ingame && <JoinLink gameid={gameid} />}
    </>
  );
};

export default Game;
