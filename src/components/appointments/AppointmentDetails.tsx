import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, Stethoscope, User, FileText, Trash2, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Appointment {
  id: string;
  title: string;
  doctor_name?: string;
  specialty?: string;
  location?: string;
  appointment_date: string;
  duration_minutes?: number;
  notes?: string;
  family_member?: {
    full_name: string;
  };
}

interface AppointmentDetailsProps {
  appointment: Appointment;
  onEdit: () => void;
  onDelete: () => void;
}

export const AppointmentDetails = ({ appointment, onEdit, onDelete }: AppointmentDetailsProps) => {
  const appointmentDate = new Date(appointment.appointment_date);

  return (
    <Card className="p-6 bg-[var(--gradient-card)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">{appointment.title}</h2>
          <Badge variant="secondary" className="text-sm">
            {format(appointmentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Horário</p>
            <p className="font-semibold">
              {format(appointmentDate, "HH:mm")}
              {appointment.duration_minutes && ` (${appointment.duration_minutes} min)`}
            </p>
          </div>
        </div>

        {appointment.family_member && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paciente</p>
              <p className="font-semibold">{appointment.family_member.full_name}</p>
            </div>
          </div>
        )}

        {appointment.doctor_name && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Médico</p>
              <p className="font-semibold">{appointment.doctor_name}</p>
              {appointment.specialty && (
                <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
              )}
            </div>
          </div>
        )}

        {appointment.location && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-semibold">{appointment.location}</p>
            </div>
          </div>
        )}

        {appointment.notes && (
          <>
            <Separator className="my-4" />
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Observações</p>
                <p className="text-sm leading-relaxed">{appointment.notes}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
