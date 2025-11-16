import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pill, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { MedicationForm } from "@/components/medications/MedicationForm";
import { MedicationCard } from "@/components/medications/MedicationCard";
import type { User } from "@supabase/supabase-js";

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
  family_member_id: string;
  family_member?: {
    full_name: string;
  };
}

interface FamilyMember {
  id: string;
  full_name: string;
}

const Medications = () => {
  const [user, setUser] = useState<User | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    loadFamilyMembers();
    loadMedications();
  };

  const loadFamilyMembers = async () => {
    const { data, error } = await supabase
      .from("family_members")
      .select("id, full_name")
      .order("full_name");

    if (error) {
      toast({
        title: "Erro ao carregar membros",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setFamilyMembers(data || []);
  };

  const loadMedications = async () => {
    const { data, error } = await supabase
      .from("medications")
      .select(`
        *,
        family_member:family_members(full_name)
      `)
      .order("name");

    if (error) {
      toast({
        title: "Erro ao carregar medicamentos",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMedications(data || []);
  };

  const handleFormSubmit = async (values: any) => {
    setIsLoading(true);

    const medicationData = {
      family_member_id: values.family_member_id,
      name: values.name,
      dosage: values.dosage,
      frequency: values.frequency,
      times: values.times,
      start_date: values.start_date.toISOString().split('T')[0],
      end_date: values.end_date ? values.end_date.toISOString().split('T')[0] : null,
      instructions: values.instructions || null,
      created_by: user?.id,
      active: true,
    };

    let error;
    if (editingMedication) {
      const { error: updateError } = await supabase
        .from("medications")
        .update(medicationData)
        .eq("id", editingMedication.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("medications")
        .insert([medicationData]);
      error = insertError;
    }

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erro ao salvar medicamento",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: editingMedication ? "Medicamento atualizado" : "Medicamento adicionado",
    });

    setIsFormOpen(false);
    setEditingMedication(null);
    loadMedications();
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication({
      ...medication,
      start_date: new Date(medication.start_date),
      end_date: medication.end_date ? new Date(medication.end_date) : undefined,
    } as any);
    setIsFormOpen(true);
  };

  const handleDelete = async (medicationId: string) => {
    const { error } = await supabase
      .from("medications")
      .delete()
      .eq("id", medicationId);

    if (error) {
      toast({
        title: "Erro ao deletar medicamento",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Medicamento deletado",
      description: "O medicamento foi removido com sucesso",
    });

    loadMedications();
  };

  const handleLogTaken = async (medicationId: string, time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(":");
    const scheduledTime = new Date(now);
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const { error } = await supabase
      .from("medication_logs")
      .insert([{
        medication_id: medicationId,
        scheduled_time: scheduledTime.toISOString(),
        taken_at: now.toISOString(),
        confirmed_by: user?.id,
      }]);

    if (error) {
      toast({
        title: "Erro ao registrar tomada",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Tomada registrada!",
      description: `Medicamento registrado às ${format(now, "HH:mm")}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="shrink-0">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
              <h1 className="text-sm sm:text-lg font-bold truncate">Medicamentos</h1>
            </div>
          </div>
          <Button onClick={() => {
            setEditingMedication(null);
            setIsFormOpen(true);
          }} size="sm" className="shrink-0">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Adicionar</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {medications.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nenhum medicamento cadastrado</h2>
            <p className="text-muted-foreground mb-6">
              Adicione o primeiro medicamento para começar o controle
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Medicamento
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onEdit={() => handleEdit(medication)}
                onDelete={() => handleDelete(medication.id)}
                onLogTaken={(time) => handleLogTaken(medication.id, time)}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMedication ? "Editar Medicamento" : "Novo Medicamento"}
            </DialogTitle>
          </DialogHeader>
          <MedicationForm
            familyMembers={familyMembers}
            onSubmit={handleFormSubmit}
            defaultValues={editingMedication ? {
              family_member_id: editingMedication.family_member_id,
              name: editingMedication.name,
              dosage: editingMedication.dosage,
              frequency: editingMedication.frequency,
              times: editingMedication.times,
              start_date: new Date(editingMedication.start_date),
              end_date: editingMedication.end_date ? new Date(editingMedication.end_date) : undefined,
              instructions: editingMedication.instructions,
            } : undefined}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Medications;
