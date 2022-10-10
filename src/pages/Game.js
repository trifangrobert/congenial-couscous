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
  const [opponentElo, setOpponentElo] = useState();
  const [userName, setUserName] = useState("");
  const [userElo, setUserElo] = useState();
  useEffect(() => {
    socket.on("startGame", (data) => {
      console.log(data);
      setOpponentName(data.opponentName);
      setOpponentElo(data.opponentElo);
      setUserName(data.userName);
      setUserElo(data.userElo);
    });
  }, [socket]);
  return (
    <>
      <PvP>
        {userElo && (
          <div className="user-data">
            {userName} ({userElo})
          </div>
        )}
        {opponentElo && (
          <div className="opponent-data">
            {opponentName} ({opponentElo})
          </div>
        )}
      </PvP>
      {!ingame && <JoinLink gameid={gameid} />}
    </>
  );
};

export default Game;
