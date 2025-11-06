import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FamilyMemberForm } from "@/components/family/FamilyMemberForm";
import { FamilyMemberCard } from "@/components/family/FamilyMemberCard";
import type { User } from "@supabase/supabase-js";

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

const FamilyMembers = () => {
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
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
    loadMembers();
  };

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .order("full_name");

    if (error) {
      toast({
        title: "Erro ao carregar membros",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMembers(data || []);
  };

  const handleFormSubmit = async (values: any) => {
    setIsLoading(true);

    const memberData = {
      full_name: values.full_name,
      date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().split('T')[0] : null,
      blood_type: values.blood_type || null,
      allergies: values.allergies.length > 0 ? values.allergies : null,
      chronic_conditions: values.chronic_conditions.length > 0 ? values.chronic_conditions : null,
      emergency_contact: values.emergency_contact || null,
      emergency_phone: values.emergency_phone || null,
      notes: values.notes || null,
      created_by: user?.id,
    };

    let error;
    if (editingMember) {
      const { error: updateError } = await supabase
        .from("family_members")
        .update(memberData)
        .eq("id", editingMember.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("family_members")
        .insert([memberData]);
      error = insertError;
    }

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erro ao salvar membro",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: editingMember ? "Perfil atualizado" : "Perfil adicionado",
    });

    setIsFormOpen(false);
    setEditingMember(null);
    loadMembers();
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember({
      ...member,
      date_of_birth: member.date_of_birth ? new Date(member.date_of_birth) : undefined,
    } as any);
    setIsFormOpen(true);
  };

  const handleDelete = async (memberId: string) => {
    const { error } = await supabase
      .from("family_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      toast({
        title: "Erro ao deletar membro",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Membro deletado",
      description: "O perfil foi removido com sucesso",
    });

    loadMembers();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold">Membros da Família</h1>
            </div>
          </div>
          <Button onClick={() => {
            setEditingMember(null);
            setIsFormOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Membro
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {members.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nenhum membro cadastrado</h2>
            <p className="text-muted-foreground mb-6">
              Adicione o primeiro membro da família para começar
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Membro
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onEdit={() => handleEdit(member)}
                onDelete={() => handleDelete(member.id)}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Editar Membro" : "Novo Membro"}
            </DialogTitle>
          </DialogHeader>
          <FamilyMemberForm
            onSubmit={handleFormSubmit}
            defaultValues={editingMember ? {
              full_name: editingMember.full_name,
              date_of_birth: editingMember.date_of_birth ? new Date(editingMember.date_of_birth) : undefined,
              blood_type: editingMember.blood_type,
              allergies: editingMember.allergies,
              chronic_conditions: editingMember.chronic_conditions,
              emergency_contact: editingMember.emergency_contact,
              emergency_phone: editingMember.emergency_phone,
              notes: editingMember.notes,
            } : undefined}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FamilyMembers;
