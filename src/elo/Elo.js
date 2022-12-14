// Function to calculate the Probability
const Probability = (rating1, rating2) => {
  return (
    (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400))
  );
};

const Elo = (props) => {
  // score 1 if player1 won, -1 if player2 won, 0 if draw
  
  let Ra = props.player1_elo;
  let Rb = props.player2_elo;
  let score = props.score;
  let K = props.K;

  if (score === 0) {
    return [Math.round(Ra), Math.round(Rb)];
  }

  let Pb = Probability(Ra, Rb);
  let Pa = Probability(Rb, Ra);

  if (score === 1) {
    Ra = Ra + K * (1 - Pa);
    Rb = Rb + K * (0 - Pb);
  }
  else {
    Ra = Ra + K * (0 - Pa);
    Rb = Rb + K * (1 - Pb);
  }
  return [Math.round(Ra), Math.round(Rb)];
};

export default Elo;
