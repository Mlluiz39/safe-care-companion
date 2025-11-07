import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "lucide-react";

export const DemoVideoDialog = () => {
  const [open, setOpen] = useState(false);

  // URLs dos vídeos de demonstração (substituir pelos vídeos reais)
  const demoVideos = {
    overview: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Substituir pela URL do vídeo de visão geral
    medications: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Substituir pela URL do vídeo de medicamentos
    appointments: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Substituir pela URL do vídeo de consultas
    documents: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Substituir pela URL do vídeo de documentos
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          <Play className="w-5 h-5" />
          Ver Demonstração
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Demonstração do Sistema</DialogTitle>
          <DialogDescription>
            Assista aos vídeos para entender como usar todas as funcionalidades
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="medications">Medicamentos</TabsTrigger>
            <TabsTrigger value="appointments">Consultas</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
              <iframe
                width="100%"
                height="100%"
                src={demoVideos.overview}
                title="Demonstração - Visão Geral"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Visão Geral do Sistema</h4>
              <p className="text-sm text-muted-foreground">
                Conheça todas as funcionalidades do Cuidado com a Saúde e como elas podem ajudar 
                no gerenciamento da saúde familiar.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
              <iframe
                width="100%"
                height="100%"
                src={demoVideos.medications}
                title="Demonstração - Medicamentos"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Gerenciamento de Medicamentos</h4>
              <p className="text-sm text-muted-foreground">
                Aprenda a adicionar medicamentos, configurar horários, registrar tomadas e 
                receber lembretes automáticos.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
              <iframe
                width="100%"
                height="100%"
                src={demoVideos.appointments}
                title="Demonstração - Consultas"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Calendário de Consultas</h4>
              <p className="text-sm text-muted-foreground">
                Veja como agendar consultas médicas, visualizar no calendário e configurar 
                lembretes para não perder nenhum compromisso.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
              <iframe
                width="100%"
                height="100%"
                src={demoVideos.documents}
                title="Demonstração - Documentos"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Upload e Gestão de Documentos</h4>
              <p className="text-sm text-muted-foreground">
                Descubra como fazer upload de exames médicos, organizar documentos por paciente 
                e visualizar PDFs e imagens.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
