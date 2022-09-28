import "./JoinLink.css";

const JoinLink = (props) => {
  return (
    <div className="join-container">
      <div className="join-label">Send this code to your opponent</div>
      <div className="room-link">{props.link}</div>
      <button onClick={() => {navigator.clipboard.writeText(props.link)}} className="copy-button">Copy</button>
    </div>
  );
};

export default JoinLink;
