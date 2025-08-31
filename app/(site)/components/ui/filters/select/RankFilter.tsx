import SelectFilter from "./SelectFilter";

interface RankFilterProps {
  ranks: string[];
  onRanksChange: (updatedRanks: string[]) => void;
  allRanks: string[];
  disabled?: boolean;
}

export default function RankFilter({ ranks, onRanksChange, allRanks, disabled }: RankFilterProps) {
  const handleChange = (newValues: string[]) => {
    if (newValues.length === 0 || newValues.length === allRanks.length) {
      onRanksChange(allRanks);
    } else {
      onRanksChange(newValues);
    }
  };

  return (
    <SelectFilter
      title="Rank"
      mode="multi"
      disabled={disabled}
      inputPlaceholder="Cerca rank..."
      onChange={handleChange}
      shouldClear={ranks.length !== allRanks.length}
      allLabel="Tutti"
      groups={[
        {
          options: allRanks.map((r) => ({
            label: r,
            value: r,
          })),
        },
      ]}
      selectedValues={ranks}
    />
  );
}
