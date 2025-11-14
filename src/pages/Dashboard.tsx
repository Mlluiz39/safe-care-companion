import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { WellnessBanner } from '@/components/dashboard/WellnessBanner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Heart,
  Calendar,
  Pill,
  FileText,
  Users,
  Bell,
  LogOut,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { User } from '@supabase/supabase-js'

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        navigate('/auth')
        return
      }

      setUser(session.user)
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth')
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast({
      title: 'Até logo!',
      description: 'Você saiu da sua conta com sucesso.',
    })
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary fill-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-xl font-bold text-foreground">
              Cuidado com a Saúde
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">
                Olá,{' '}
                <span className="font-semibold text-foreground">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <WellnessBanner />

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <Pill className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-sm text-muted-foreground">Medicamentos Ativos</p>
          </Card>

          <Card className="p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-secondary" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-sm text-muted-foreground">Próximas Consultas</p>
          </Card>

          <Card className="p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-accent" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-sm text-muted-foreground">Exames Salvos</p>
          </Card>

          <Card className="p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-sm text-muted-foreground">Membros da Família</p>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/medications')}
          >
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Pill className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Medicamentos</h3>
            <p className="text-muted-foreground mb-4">
              Adicione e gerencie medicamentos do seu familiar
            </p>
            <Button variant="default" className="w-full">
              Gerenciar Medicamentos
            </Button>
          </Card>

          <Card
            className="p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/appointments')}
          >
            <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Consultas</h3>
            <p className="text-muted-foreground mb-4">
              Agende consultas médicas e receba lembretes
            </p>
            <Button variant="secondary" className="w-full">
              Ver Agenda
            </Button>
          </Card>

          <Card
            className="p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/documents')}
          >
            <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Exames</h3>
            <p className="text-muted-foreground mb-4">
              Faça upload e organize exames médicos
            </p>
            <Button variant="orange" className="w-full">
              Adicionar Exame
            </Button>
          </Card>

          <Card
            className="p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/family')}
          >
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Família</h3>
            <p className="text-muted-foreground mb-4">
              Adicione membros da família e gerencie permissões
            </p>
            <Button variant="default" className="w-full">
              Gerenciar Família
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group">
            <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bell className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Notificações</h3>
            <p className="text-muted-foreground mb-4">
              Configure lembretes automáticos
            </p>
            <Button variant="secondary" className="w-full">
              Configurar
            </Button>
          </Card>

          <Card
            className="p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/family')}
          >
            <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 text-accent fill-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Idosos</h3>
            <p className="text-muted-foreground mb-4">
              Adicione perfis de idosos para cuidar
            </p>
            <Button variant="orange" className="w-full">
              Adicionar Idoso
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
