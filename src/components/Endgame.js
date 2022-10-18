import Modal from '../UI/Modal';
import classes from "./Endgame.module.css";

const Endgame = (props) => {
  return (
    <Modal>
      <p className={classes.p}>{props.message}</p>
      <div className={classes['button-container']}>
          <button onClick={props.handleButtonMenu} className={classes.button}>Back to menu</button>
      </div>
    </Modal>
  );
};

export default Endgame;