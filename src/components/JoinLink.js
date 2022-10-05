import "./JoinLink.css";

const JoinLink = (props) => {
  return (
    <div className="join-container">
      <div className="join-label">Send this code to your opponent</div>
      <div className="room-link">{props.gameid}</div>
      <button onClick={() => {navigator.clipboard.writeText(props.gameid)}} className="copy-button">Copy</button>
    </div>
  );
};

export default JoinLink;
