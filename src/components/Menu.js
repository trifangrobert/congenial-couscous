import "./Menu.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { socket } from "../connection/socket";

const Menu = () => {
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
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  const handleCreateRoom = () => {
    const newGameRoomId = uuidv4();
    console.log(newGameRoomId);
    socket.emit('createNewGame', name, newGameRoomId);
  }
  return (
    <div className="menu-container">
      <div className="welcome">Welcome to chess, {name}!</div>
      <button className="menu-button" onClick={handleCreateRoom}>Create Room</button>
      <button className="menu-button">Join Room</button>
    </div>
  );
};

export default Menu;
