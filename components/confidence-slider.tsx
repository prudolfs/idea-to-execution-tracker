import { cn } from "@/lib/utils";

interface ConfidenceSliderProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  className?: string;
}

export function ConfidenceSlider({ value, onChange, readonly = false, className }: ConfidenceSliderProps) {
  const getColor = (val: number) => {
    if (val < 33) return "bg-destructive";
    if (val < 66) return "bg-warning";
    return "bg-success";
  };

  const getLabel = (val: number) => {
    if (val < 33) return "Low";
    if (val < 66) return "Medium";
    return "High";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Confidence</span>
        <span className={cn(
          "text-sm font-semibold px-2 py-0.5 rounded",
          value < 33 && "text-destructive",
          value >= 33 && value < 66 && "text-warning",
          value >= 66 && "text-success"
        )}>
          {getLabel(value)}
        </span>
      </div>
      <div className="relative">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300 rounded-full", getColor(value))}
            style={{ width: `${value}%` }}
          />
        </div>
        {!readonly && (
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange?.(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
