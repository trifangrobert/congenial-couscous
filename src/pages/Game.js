import { useParams } from "react-router-dom";
import PvP from "../chess/PvP";
import JoinLink from "../components/JoinLink";

const Game = () => {
  const { gameid } = useParams();
  return (
    <>
      <JoinLink link={gameid}></JoinLink>
      <PvP />
    </>
  );
};

export default Game;
