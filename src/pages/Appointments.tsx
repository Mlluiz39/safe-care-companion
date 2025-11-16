import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Plus, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentDetails } from "@/components/appointments/AppointmentDetails";
import type { User } from "@supabase/supabase-js";

interface Appointment {
  id: string;
  title: string;
  doctor_name?: string;
  specialty?: string;
  location?: string;
  appointment_date: string;
  appointment_time?: string;
  duration_minutes?: number;
  notes?: string;
  family_member_id: string;
  family_member?: {
    full_name: string;
  };
}

interface FamilyMember {
  id: string;
  full_name: string;
}

interface AppointmentFormValues {
  family_member_id: string;
  title: string;
  doctor_name?: string;
  specialty?: string;
  location?: string;
  appointment_date: string | Date;
  appointment_time: string;
  duration_minutes?: number;
  notes?: string;
}

const Appointments = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
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
    loadAppointments();
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

  const loadAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        family_member:family_members(full_name)
      `)
      .order("appointment_date");

    if (error) {
      toast({
        title: "Erro ao carregar consultas",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setAppointments(data || []);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const handleFormSubmit = async (values: Partial<AppointmentFormValues>) => {
    setIsLoading(true);

    // Validate required fields coming from the form (family member, title, date and time)
    if (!values.family_member_id || !values.title || !values.appointment_date || !values.appointment_time) {
      setIsLoading(false);
      toast({
        title: "Dados incompletos",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const appointmentDateTime = new Date(values.appointment_date as Date | string);
    const [hours, minutes] = (values.appointment_time as string).split(":");
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const appointmentData = {
      family_member_id: values.family_member_id,
      title: values.title,
      doctor_name: values.doctor_name || null,
      specialty: values.specialty || null,
      location: values.location || null,
      appointment_date: appointmentDateTime.toISOString(),
      duration_minutes: values.duration_minutes,
      notes: values.notes || null,
      created_by: user?.id,
    };

    let error: { message?: string } | null = null;
    if (editingAppointment) {
      const { error: updateError } = await supabase
        .from("appointments")
        .update(appointmentData)
        .eq("id", editingAppointment.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("appointments")
        .insert([appointmentData]);
      error = insertError;
    }

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erro ao salvar consulta",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: editingAppointment ? "Consulta atualizada" : "Consulta agendada",
    });

    setIsFormOpen(false);
    setEditingAppointment(null);
    loadAppointments();
  };

  const handleEdit = () => {
    if (selectedAppointment) {
      const appointmentDate = new Date(selectedAppointment.appointment_date);
      setEditingAppointment({
        ...selectedAppointment,
        appointment_time: appointmentDate.toTimeString().slice(0, 5),
      } as never);
      setIsDetailsOpen(false);
      setIsFormOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", selectedAppointment.id);

    if (error) {
      toast({
        title: "Erro ao deletar consulta",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Consulta deletada",
      description: "A consulta foi removida com sucesso",
    });

    setIsDetailsOpen(false);
    setSelectedAppointment(null);
    loadAppointments();
  };

  function handleDateClick(date: Date): void {
    // open the form to create a new appointment for the clicked date
    setSelectedDate(date);
    setEditingAppointment(null);
    setSelectedAppointment(null);
    setIsFormOpen(true);
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-8 h-8 text-secondary" />
              <h1 className="text-lg font-bold">Consultas Médicas</h1>
            </div>
          </div>
          <Button onClick={() => {
            setEditingAppointment(null);
            setSelectedDate(null);
            setIsFormOpen(true);
          }}>
            <Plus className="w-2 h-2 mr-2" />
            Nova Consulta
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AppointmentCalendar
          appointments={appointments}
          onDateClick={handleDateClick}
          onAppointmentClick={handleAppointmentClick}
        />
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? "Editar Consulta" : "Nova Consulta"}
            </DialogTitle>
          </DialogHeader>
          <AppointmentForm
            familyMembers={familyMembers}
            defaultValues={
              editingAppointment
                ? {
                    family_member_id: editingAppointment.family_member_id,
                    title: editingAppointment.title,
                    doctor_name: editingAppointment.doctor_name,
                    specialty: editingAppointment.specialty,
                    location: editingAppointment.location,
                    appointment_date: new Date(editingAppointment.appointment_date),
                    appointment_time: editingAppointment.appointment_time,
                    duration_minutes: editingAppointment.duration_minutes,
                    notes: editingAppointment.notes,
                  }
                : selectedDate
                ? {
                    appointment_date: selectedDate,
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Consulta</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentDetails
              appointment={selectedAppointment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
