import { useParams } from "react-router-dom";
import PvP from "../chess/PvP";
import JoinLink from "../components/JoinLink";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const Game = () => {
  const { gameid } = useParams();
  const { ingame } = useContext(UserContext);
  return (
    <>
      <PvP />
      {!ingame && <JoinLink gameid={gameid} />}
      <PvP />
    </>
  );
};

export default Game;
