import { Grid, List } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ViewTogglerProps {
  activeValue: string;
  onClick: React.Dispatch<React.SetStateAction<"list" | "grid">>;
}

export const ViewToggler = ({ activeValue, onClick }: ViewTogglerProps) => {
  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => onClick("grid")}
        className={cn(activeValue === "grid" && "bg-primary-foreground")}
      >
        <Grid />
      </Button>
      <Button
        variant="ghost"
        onClick={() => onClick("list")}
        className={cn(activeValue === "list" && "bg-primary-foreground")}
      >
        <List />
      </Button>
    </div>
  );
};
