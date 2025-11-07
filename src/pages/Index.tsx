import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Calendar, FileText, Users, Bell, Shield } from "lucide-react";
import heroImage from "@/assets/hero-family.jpg";
import medicationIcon from "@/assets/icon-medication.png";
import appointmentIcon from "@/assets/icon-appointment.png";
import familyIcon from "@/assets/icon-family.png";
import { DemoVideoDialog } from "@/components/DemoVideoDialog";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-xl font-bold text-foreground">Cuidado com a Saúde</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Funcionalidades
            </a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Benefícios
            </a>
            <Link to="/auth">
              <Button variant="outline" size="sm">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" size="sm">Começar Grátis</Button>
            </Link>
          </nav>
          <Link to="/auth" className="md:hidden">
            <Button variant="hero" size="sm">Começar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10"></div>
        <div className="absolute inset-0 bg-[var(--gradient-wellness)]"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1 bg-secondary/10 rounded-full mb-6">
                <span className="text-sm font-medium text-secondary">100% Gratuito • Offline • PWA</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Cuide da saúde da sua família com amor
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Gerenciador familiar de saúde para idosos. Acompanhe medicamentos, consultas e exames de forma colaborativa e segura.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    <Heart className="w-5 h-5" />
                    Começar Gratuitamente
                  </Button>
                </Link>
                <DemoVideoDialog />
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Família feliz gerenciando saúde juntos" 
                className="rounded-2xl shadow-[var(--shadow-strong)] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa em um só lugar
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades pensadas especialmente para facilitar o cuidado com a saúde dos seus entes queridos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-[var(--shadow-medium)] transition-all bg-[var(--gradient-card)]">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <img src={medicationIcon} alt="Medicamentos" className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Controle de Medicamentos</h4>
              <p className="text-muted-foreground">
                Horários, dosagens e confirmação de tomadas com lembretes inteligentes
              </p>
            </Card>

            <Card className="p-6 hover:shadow-[var(--shadow-medium)] transition-all bg-[var(--gradient-card)]">
              <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <img src={appointmentIcon} alt="Consultas" className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Agenda de Consultas</h4>
              <p className="text-muted-foreground">
                Calendário visual com lembretes automáticos para não perder nenhuma consulta
              </p>
            </Card>

            <Card className="p-6 hover:shadow-[var(--shadow-medium)] transition-all bg-[var(--gradient-card)]">
              <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Gestão de Exames</h4>
              <p className="text-muted-foreground">
                Upload e visualização de PDFs e imagens de exames médicos
              </p>
            </Card>

            <Card className="p-6 hover:shadow-[var(--shadow-medium)] transition-all bg-[var(--gradient-card)]">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <img src={familyIcon} alt="Família" className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Acesso Familiar</h4>
              <p className="text-muted-foreground">
                Compartilhamento seguro entre membros da família com controle de permissões
              </p>
            </Card>

            <Card className="p-6 hover:shadow-[var(--shadow-medium)] transition-all bg-[var(--gradient-card)]">
              <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Bell className="w-10 h-10 text-secondary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Notificações Inteligentes</h4>
              <p className="text-muted-foreground">
                Lembretes automáticos no navegador para medicamentos e consultas
              </p>
            </Card>

            <Card className="p-6 hover:shadow-[var(--shadow-medium)] transition-all bg-[var(--gradient-card)]">
              <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Segurança Total</h4>
              <p className="text-muted-foreground">
                Dados criptografados com controle de acesso e privacidade garantida
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Por que escolher Cuidado com a Saúde?
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">100% Gratuito</h5>
                    <p className="text-muted-foreground">Sem custos ocultos, sem mensalidades. Para sempre.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Offline First</h5>
                    <p className="text-muted-foreground">Funciona sem internet e sincroniza automaticamente.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">PWA - Instalável</h5>
                    <p className="text-muted-foreground">Instale como app no celular sem usar a loja de apps.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10 rounded-2xl"></div>
              <Card className="p-8 relative bg-[var(--gradient-card)]">
                <Calendar className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-2xl font-bold mb-4">Pronto para começar?</h4>
                <p className="text-muted-foreground mb-6">
                  Crie sua conta gratuitamente e comece a cuidar melhor da saúde da sua família hoje mesmo.
                </p>
                <Link to="/auth">
                  <Button variant="hero" size="lg" className="w-full">
                    Criar Conta Grátis
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary fill-primary" />
              <span className="font-semibold">Cuidado com a Saúde</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 Cuidado com a Saúde. Gerenciador familiar para idosos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
