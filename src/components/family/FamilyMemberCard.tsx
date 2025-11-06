import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Calendar, Droplet, AlertCircle, Heart, Phone, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FamilyMember {
  id: string;
  full_name: string;
  date_of_birth?: string;
  blood_type?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  emergency_contact?: string;
  emergency_phone?: string;
  notes?: string;
}

interface FamilyMemberCardProps {
  member: FamilyMember;
  onEdit: () => void;
  onDelete: () => void;
}

export const FamilyMemberCard = ({ member, onEdit, onDelete }: FamilyMemberCardProps) => {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card className="p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{member.full_name}</h3>
            {member.date_of_birth && (
              <p className="text-sm text-muted-foreground">
                {calculateAge(member.date_of_birth)} anos
              </p>
            )}
          </div>
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

      <Separator className="my-3" />

      <div className="space-y-3">
        {member.date_of_birth && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Nascimento:</span>
            <span className="font-medium">
              {format(new Date(member.date_of_birth), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        )}

        {member.blood_type && (
          <div className="flex items-center gap-2 text-sm">
            <Droplet className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tipo Sanguíneo:</span>
            <Badge variant="outline">{member.blood_type}</Badge>
          </div>
        )}

        {member.allergies && member.allergies.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
            <div className="flex-1">
              <span className="text-muted-foreground block mb-1">Alergias:</span>
              <div className="flex flex-wrap gap-1">
                {member.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {member.chronic_conditions && member.chronic_conditions.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Heart className="w-4 h-4 text-secondary mt-0.5" />
            <div className="flex-1">
              <span className="text-muted-foreground block mb-1">Condições Crônicas:</span>
              <div className="flex flex-wrap gap-1">
                {member.chronic_conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {(member.emergency_contact || member.emergency_phone) && (
          <>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                <span className="font-semibold">Emergência:</span>
              </div>
              {member.emergency_contact && (
                <p className="text-sm ml-6">{member.emergency_contact}</p>
              )}
              {member.emergency_phone && (
                <p className="text-sm ml-6 font-medium">{member.emergency_phone}</p>
              )}
            </div>
          </>
        )}

        {member.notes && (
          <>
            <Separator className="my-2" />
            <div className="text-sm">
              <p className="text-muted-foreground mb-1">Observações:</p>
              <p className="leading-relaxed">{member.notes}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
