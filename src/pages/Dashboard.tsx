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
  const [stats, setStats] = useState({
    medications: 0,
    appointments: 0,
    documents: 0,
    familyMembers: 0,
  })
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
      await loadStats()
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
        loadStats()
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const loadStats = async () => {
    try {
      // Count active medications
      const { count: medicationsCount } = await supabase
        .from('medications')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)

      // Count upcoming appointments
      const { count: appointmentsCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('appointment_date', new Date().toISOString())

      // Count medical documents
      const { count: documentsCount } = await supabase
        .from('medical_documents')
        .select('*', { count: 'exact', head: true })

      // Count family members
      const { count: familyMembersCount } = await supabase
        .from('family_members')
        .select('*', { count: 'exact', head: true })

      setStats({
        medications: medicationsCount || 0,
        appointments: appointmentsCount || 0,
        documents: documentsCount || 0,
        familyMembers: familyMembersCount || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary fill-primary" />
            <h1 className="text-base sm:text-xl font-bold text-foreground">
              Cuidado com a Saúde
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">
                Olá,{' '}
                <span className="font-semibold text-foreground">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 sm:h-10 sm:w-10">
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Welcome Banner */}
        <WellnessBanner />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <span className="text-xl sm:text-2xl font-bold">{stats.medications}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Medicamentos Ativos</p>
          </Card>

          <Card className="p-3 sm:p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
              <span className="text-xl sm:text-2xl font-bold">{stats.appointments}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Próximas Consultas</p>
          </Card>

          <Card className="p-3 sm:p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
              <span className="text-xl sm:text-2xl font-bold">{stats.documents}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Exames Salvos</p>
          </Card>

          <Card className="p-3 sm:p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <span className="text-xl sm:text-2xl font-bold">{stats.familyMembers}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Membros da Família</p>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card
            className="p-4 sm:p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/medications')}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Medicamentos</h3>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
              Adicione e gerencie medicamentos do seu familiar
            </p>
            <Button variant="default" className="w-full text-sm sm:text-base">
              Gerenciar Medicamentos
            </Button>
          </Card>

          <Card
            className="p-4 sm:p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/appointments')}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Consultas</h3>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
              Agende consultas médicas e receba lembretes
            </p>
            <Button variant="secondary" className="w-full text-sm sm:text-base">
              Ver Agenda
            </Button>
          </Card>

          <Card
            className="p-4 sm:p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/documents')}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Exames</h3>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
              Faça upload e organize exames médicos
            </p>
            <Button variant="orange" className="w-full text-sm sm:text-base">
              Adicionar Exame
            </Button>
          </Card>

          <Card
            className="p-4 sm:p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/family')}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Família</h3>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
              Adicione membros da família e gerencie permissões
            </p>
            <Button variant="default" className="w-full text-sm sm:text-base">
              Gerenciar Família
            </Button>
          </Card>

          <Card className="p-4 sm:p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Notificações</h3>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
              Configure lembretes automáticos
            </p>
            <Button variant="secondary" className="w-full text-sm sm:text-base">
              Configurar
            </Button>
          </Card>

          <Card
            className="p-4 sm:p-6 hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer bg-[var(--gradient-card)] group"
            onClick={() => navigate('/family')}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-accent fill-accent" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Idosos</h3>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
              Adicione perfis de idosos para cuidar
            </p>
            <Button variant="orange" className="w-full text-sm sm:text-base">
              Adicionar Idoso
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
