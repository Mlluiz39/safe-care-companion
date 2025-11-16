import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pill, Clock, Calendar, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  start_date: string;
  end_date?: string;
  instructions?: string;
  active: boolean;
  family_member?: {
    full_name: string;
  };
}

interface MedicationCardProps {
  medication: Medication;
  onEdit: () => void;
  onDelete: () => void;
  onLogTaken?: (time: string) => void;
}

const frequencyLabels: Record<string, string> = {
  daily: "Diariamente",
  weekly: "Semanalmente",
  biweekly: "Quinzenalmente",
  monthly: "Mensalmente",
  as_needed: "Quando necessário",
};

export const MedicationCard = ({ medication, onEdit, onDelete, onLogTaken }: MedicationCardProps) => {
  return (
    <Card className="p-4 sm:p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-xl font-semibold truncate">{medication.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{medication.dosage}</p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 sm:h-10 sm:w-10">
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 sm:h-10 sm:w-10">
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {medication.family_member && (
        <Badge variant="secondary" className="mb-3">
          {medication.family_member.full_name}
        </Badge>
      )}

      <Separator className="my-3" />

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Frequência:</span>
          <span className="font-medium truncate">{frequencyLabels[medication.frequency]}</span>
        </div>

        <div className="flex items-start gap-2 text-xs sm:text-sm">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-muted-foreground">Horários:</span>
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
              {medication.times.map((time) => (
                <div key={time} className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">{time}</Badge>
                  {onLogTaken && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      onClick={() => onLogTaken(time)}
                    >
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs sm:text-sm">
          <span className="text-muted-foreground">Período:</span>
          <span className="ml-2 font-medium">
            {format(new Date(medication.start_date), "dd/MM/yyyy", { locale: ptBR })}
            {medication.end_date && 
              ` até ${format(new Date(medication.end_date), "dd/MM/yyyy", { locale: ptBR })}`
            }
            {!medication.end_date && " (Uso contínuo)"}
          </span>
        </div>

        {medication.instructions && (
          <div className="text-xs sm:text-sm pt-2 border-t">
            <p className="text-muted-foreground mb-1">Instruções:</p>
            <p className="leading-relaxed break-words">{medication.instructions}</p>
          </div>
        )}
      </div>

      {!medication.active && (
        <Badge variant="destructive" className="mt-3">
          Inativo
        </Badge>
      )}
    </Card>
  );
};
