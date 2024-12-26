import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CustomerWithDetails } from "../../models";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScoreDialogProps {
  customer: CustomerWithDetails;
}

export default function ScoreDialog({ customer }: ScoreDialogProps) {
  // State for calculated scores and manual input score
  const [frequencyScore, setFrequencyScore] = useState(0);
  const [spendingScore, setSpendingScore] = useState(0);
  const [recencyScore, setRecencyScore] = useState(0);
  const [suggestedScore, setSuggestedScore] = useState(0);
  const [manualScore, setManualScore] = useState<number | string>("");

  // Constants for weights and multipliers
  const FREQUENCY_WEEK_MULTIPLIER = 0.5;
  const FREQUENCY_MONTH_MULTIPLIER = 0.3;
  const FREQUENCY_YEAR_MULTIPLIER = 0.2;
  const SPENDING_TOTAL_MULTIPLIER = 2;
  const SPENDING_AVERAGE_MULTIPLIER = 2;
  const RECENCY_DECAY_RATE = 30; // Days
  const WEIGHTS = { frequency: 0.4, spending: 0.4, recency: 0.2 };
  const SCORE_SCALING_FACTOR = 10;

  // 1. Frequency Score function
  function calculateFrequencyScore(orders: any[]) {
    const weeks = new Set(
      orders.map((order) => format(new Date(order.order.created_at), "yyyy-ww"))
    ).size;
    const months = new Set(
      orders.map((order) => format(new Date(order.order.created_at), "yyyy-MM"))
    ).size;
    const years = new Set(orders.map((order) => format(new Date(order.order.created_at), "yyyy")))
      .size;

    return Math.min(
      10,
      weeks * FREQUENCY_WEEK_MULTIPLIER +
        months * FREQUENCY_MONTH_MULTIPLIER +
        years * FREQUENCY_YEAR_MULTIPLIER
    );
  }

  // 2. Spending Score function
  function calculateSpendingScore(orders: any[]) {
    const totalSpent = orders.reduce((sum, order) => sum + order.order.total, 0);
    const averageSpent = totalSpent / (orders.length || 1); // Avoid division by zero

    return Math.min(
      10,
      Math.log10(totalSpent + 1) * SPENDING_TOTAL_MULTIPLIER +
        Math.log10(averageSpent + 1) * SPENDING_AVERAGE_MULTIPLIER
    );
  }

  // 3. Recency Score function
  function calculateRecencyScore(orders: any[]) {
    const lastOrderDate = orders.reduce((latest, order) => {
      const orderDate = new Date(order.order.created_at);
      return orderDate > latest ? orderDate : latest;
    }, new Date(0));

    const daysSinceLastOrder = (Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 10 - daysSinceLastOrder / RECENCY_DECAY_RATE);
  }

  // 4. Weighted Final Score function
  function calculateCustomerScore() {
    const orders = [...customer.home_orders, ...customer.pickup_orders];

    const calculatedFrequencyScore = calculateFrequencyScore(orders);
    const calculatedSpendingScore = calculateSpendingScore(orders);
    const calculatedRecencyScore = calculateRecencyScore(orders);

    setFrequencyScore(calculatedFrequencyScore);
    setSpendingScore(calculatedSpendingScore);
    setRecencyScore(calculatedRecencyScore);

    const rawScore =
      WEIGHTS.frequency * calculatedFrequencyScore +
      WEIGHTS.spending * calculatedSpendingScore +
      WEIGHTS.recency * calculatedRecencyScore;

    const scaledScore = rawScore * SCORE_SCALING_FACTOR;
    setSuggestedScore(Number(scaledScore.toFixed(2))); // Round to 2 decimal places
  }

  // Handle manual score input change
  const handleManualScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && value !== "") {
      setManualScore(Number(value));
    } else if (value === "") {
      setManualScore(""); // Allow empty input
    }
  };

  // useEffect(() => {
  //   calculateCustomerScore();
  // }, []);

  return suggestedScore.toFixed(2);
  // <div>
  //   {/* <h3>4. Punteggio Consigliato</h3> */}
  //   <p>{`${}`}</p>
  // </div>
  // <DialogWrapper
  //   onOpenChange={(open) => calculateCustomerScore()}
  //   title="Punteggio cliente"
  //   trigger={<Button>PUNTEGGIO</Button>}
  //   contentClassName="space-y-4"
  // >
  //   <div>
  //     <h3>1. Frequenza di Acquisto</h3>
  //     <p>{`Punteggio Frequenza: ${frequencyScore.toFixed(
  //       2
  //     )} (Valutato sulla base della frequenza di acquisto settimanale, mensile e annuale)`}</p>
  //   </div>

  //   <div>
  //     <h3>2. Spesa Totale e Media</h3>
  //     <p>{`Punteggio Spesa: ${spendingScore.toFixed(
  //       2
  //     )} (Valutato sulla base della spesa totale e media per ordine)`}</p>
  //   </div>

  //   <div>
  //     <h3>3. Recenza degli Acquisti</h3>
  //     <p>{`Punteggio Recenza: ${recencyScore.toFixed(
  //       2
  //     )} (Valutato sulla base della recenza degli acquisti)`}</p>
  //   </div>

  //   <div>
  //     <h3>4. Punteggio Consigliato</h3>
  //     <p>{`Punteggio Finale (consigliato): ${suggestedScore.toFixed(2)}`}</p>
  //   </div>

  //   <div>
  //     <h3 className="mb-2">5. Punteggio Manuale</h3>
  //     <Input
  //       type="number"
  //       value={manualScore}
  //       onChange={handleManualScoreChange}
  //       placeholder="Inserisci il punteggio manuale"
  //     />
  //   </div>
  // </DialogWrapper>
}
