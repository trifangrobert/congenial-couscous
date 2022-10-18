// Function to calculate the Probability
const Probability = (rating1, rating2) => {
  return (
    (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400))
  );
};

// Function to calculate Elo rating
// K is a constant.
// d determines whether Player A wins
// or Player B.
function EloRating(Ra, Rb, K, d) {
  // To calculate the Winning
  // Probability of Player B
  let Pb = Probability(Ra, Rb);

  // To calculate the Winning
  // Probability of Player A
  let Pa = Probability(Rb, Ra);

  // Case 1 When Player A wins
  // Updating the Elo Ratings
  if (d === true) {
    Ra = Ra + K * (1 - Pa);
    Rb = Rb + K * (0 - Pb);
  }

  // Case 2 When Player B wins
  // Updating the Elo Ratings
  else {
    Ra = Ra + K * (0 - Pa);
    Rb = Rb + K * (1 - Pb);
  }

  document.write("Updated Ratings:-<br>");
  document.write(
    "Ra = " +
      Math.round(Ra * 1000000.0) / 1000000.0 +
      " Rb = " +
      Math.round(Rb * 1000000.0) / 1000000.0
  );
}

const Elo = (props) => {
  // score 1 if player1 won, -1 if player2 won, 0 if draw
  
  let Ra = props.player1_elo;
  let Rb = props.player2_elo;
  let score = props.score;
  let K = props.K;

  if (score === 0) {
    return [Ra, Rb];
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
  return [Ra, Rb];
};

export default Elo;
