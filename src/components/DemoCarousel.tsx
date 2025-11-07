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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import demoDashboard from "@/assets/demo-dashboard.jpg";
import demoMedications from "@/assets/demo-medications.jpg";
import demoAppointments from "@/assets/demo-appointments.jpg";
import demoDocuments from "@/assets/demo-documents.jpg";

const demoSlides = [
  {
    image: demoDashboard,
    title: "Dashboard Principal",
    description: "Visão geral completa com calendário de consultas, lembretes de medicamentos e perfis familiares em um só lugar.",
  },
  {
    image: demoMedications,
    title: "Gerenciamento de Medicamentos",
    description: "Controle total sobre medicamentos com horários personalizados, dosagens e confirmação de tomadas com um toque.",
  },
  {
    image: demoAppointments,
    title: "Calendário de Consultas",
    description: "Agende e visualize todas as consultas médicas em um calendário mensal intuitivo com detalhes completos.",
  },
  {
    image: demoDocuments,
    title: "Documentos Médicos",
    description: "Organize exames, prescrições e documentos de saúde com upload fácil e visualização rápida de PDFs e imagens.",
  },
];

export const DemoCarousel = () => {
  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          <Play className="w-5 h-5" />
          Ver Demonstração
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Demonstração do Sistema</DialogTitle>
          <DialogDescription>
            Navegue pelas principais funcionalidades do Cuidado com a Saúde
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {demoSlides.map((slide, index) => (
                <CarouselItem key={index}>
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-0 space-y-4">
                      <div className="relative rounded-lg overflow-hidden shadow-[var(--shadow-medium)]">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div className="text-center space-y-2 px-4">
                        <h4 className="text-xl font-semibold text-foreground">
                          {slide.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {slide.description}
                        </p>
                        <div className="flex justify-center gap-2 pt-2">
                          {demoSlides.map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 rounded-full transition-all ${
                                i === index
                                  ? "w-8 bg-primary"
                                  : "w-2 bg-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              <CarouselPrevious className="relative left-0 translate-x-0 translate-y-0" />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
              <CarouselNext className="relative right-0 translate-x-0 translate-y-0" />
            </div>
          </Carousel>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
            {demoSlides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="group relative rounded-lg overflow-hidden border-2 transition-all hover:border-primary"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-20 object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                  <p className="text-xs font-medium text-white truncate">
                    {slide.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
