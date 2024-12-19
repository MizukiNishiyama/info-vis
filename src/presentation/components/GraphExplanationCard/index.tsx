type GraphInfoCardProps = {
  ref: React.RefObject<HTMLDivElement>;
  explanation: string;
};

export const GraphExplanationCard: React.FC<GraphInfoCardProps> = ({ ref, explanation }) => {
  return (
    <div
      ref={ref}
      className="absolute z-50 p-4 bg-white border rounded shadow-lg top-10 left-40 w-[350px]"
    >
      <h3 className="text-lg font-bold mb-2">About Graph</h3>
      <p className="text-sm whitespace-pre-line">{explanation}</p>
    </div>
  );
};
