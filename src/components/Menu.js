import "./Menu.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { socket } from "../connection/socket";

const Menu = () => {
  const [code, setCode] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (error) console.log(error);
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  const handleCreateRoom = () => {
    const newGameRoomId = uuidv4();
    console.log(newGameRoomId);
    socket.emit("createRoom", {name: name, roomId: newGameRoomId});
    navigate("/game/" + newGameRoomId);
  };
  
  const handleJoinRoom = () => {
    socket.emit("joinRoom", {name: name, roomId: code});
    navigate("/game/" + code);
  };
  return (
    <div className="menu-container">
      <div className="welcome">Welcome to chess, {name}!</div>
      <button className="create-button" onClick={handleCreateRoom}>
        Create a room
      </button>
      <div className="join-room">
        <input
          className="join-link"
          type="text"
          placeholder="Room's code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="join-button" onClick={handleJoinRoom}>
          Join
        </button>
      </div>
    </div>
  );
};

export default Menu;
