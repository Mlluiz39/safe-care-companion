import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

const formSchema = z.object({
  full_name: z.string().min(1, "Nome é obrigatório"),
  date_of_birth: z.date().optional(),
  blood_type: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  chronic_conditions: z.array(z.string()).default([]),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FamilyMemberFormProps {
  onSubmit: (values: FormValues) => void;
  defaultValues?: Partial<FormValues>;
  isLoading?: boolean;
}

export const FamilyMemberForm = ({ onSubmit, defaultValues, isLoading }: FamilyMemberFormProps) => {
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [calendarMonth, setCalendarMonth] = useState<Date>(defaultValues?.date_of_birth || new Date());
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: defaultValues?.full_name || "",
      date_of_birth: defaultValues?.date_of_birth,
      blood_type: defaultValues?.blood_type || "",
      allergies: defaultValues?.allergies || [],
      chronic_conditions: defaultValues?.chronic_conditions || [],
      emergency_contact: defaultValues?.emergency_contact || "",
      emergency_phone: defaultValues?.emergency_phone || "",
      notes: defaultValues?.notes || "",
    },
  });

  const addAllergy = () => {
    if (newAllergy.trim()) {
      const current = form.getValues("allergies");
      form.setValue("allergies", [...current, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const current = form.getValues("allergies");
    form.setValue("allergies", current.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      const current = form.getValues("chronic_conditions");
      form.setValue("chronic_conditions", [...current, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    const current = form.getValues("chronic_conditions");
    form.setValue("chronic_conditions", current.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Maria da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Nascimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 pointer-events-auto">
                      {/* Header com navegação */}
                      <div className="flex items-center justify-between mb-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            if (viewMode === 'day') {
                              const newMonth = new Date(calendarMonth);
                              newMonth.setMonth(newMonth.getMonth() - 1);
                              setCalendarMonth(newMonth);
                            } else if (viewMode === 'month') {
                              const newYear = new Date(calendarMonth);
                              newYear.setFullYear(newYear.getFullYear() - 1);
                              setCalendarMonth(newYear);
                            } else {
                              const newDecade = new Date(calendarMonth);
                              newDecade.setFullYear(newDecade.getFullYear() - 12);
                              setCalendarMonth(newDecade);
                            }
                          }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-sm font-medium"
                            onClick={() => setViewMode(viewMode === 'month' ? 'day' : 'month')}
                          >
                            {format(calendarMonth, 'MMMM', { locale: ptBR })}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-sm font-medium"
                            onClick={() => setViewMode(viewMode === 'year' ? 'day' : 'year')}
                          >
                            {format(calendarMonth, 'yyyy')}
                          </Button>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            if (viewMode === 'day') {
                              const newMonth = new Date(calendarMonth);
                              newMonth.setMonth(newMonth.getMonth() + 1);
                              setCalendarMonth(newMonth);
                            } else if (viewMode === 'month') {
                              const newYear = new Date(calendarMonth);
                              newYear.setFullYear(newYear.getFullYear() + 1);
                              setCalendarMonth(newYear);
                            } else {
                              const newDecade = new Date(calendarMonth);
                              newDecade.setFullYear(newDecade.getFullYear() + 12);
                              setCalendarMonth(newDecade);
                            }
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Seletor de ano */}
                      {viewMode === 'year' && (
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: 12 }, (_, i) => {
                            const year = Math.floor(calendarMonth.getFullYear() / 12) * 12 + i;
                            return (
                              <Button
                                key={year}
                                type="button"
                                variant={calendarMonth.getFullYear() === year ? 'default' : 'ghost'}
                                className="h-9"
                                onClick={() => {
                                  const newDate = new Date(calendarMonth);
                                  newDate.setFullYear(year);
                                  setCalendarMonth(newDate);
                                  setViewMode('month');
                                }}
                                disabled={year > new Date().getFullYear()}
                              >
                                {year}
                              </Button>
                            );
                          })}
                        </div>
                      )}

                      {/* Seletor de mês */}
                      {viewMode === 'month' && (
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: 12 }, (_, i) => {
                            const monthDate = new Date(calendarMonth.getFullYear(), i, 1);
                            const isDisabled = monthDate > new Date();
                            return (
                              <Button
                                key={i}
                                type="button"
                                variant={calendarMonth.getMonth() === i ? 'default' : 'ghost'}
                                className="h-9"
                                onClick={() => {
                                  const newDate = new Date(calendarMonth);
                                  newDate.setMonth(i);
                                  setCalendarMonth(newDate);
                                  setViewMode('day');
                                }}
                                disabled={isDisabled}
                              >
                                {format(monthDate, 'MMM', { locale: ptBR })}
                              </Button>
                            );
                          })}
                        </div>
                      )}

                      {/* Seletor de dia */}
                      {viewMode === 'day' && (
                        <DayPicker
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            if (date) setCalendarMonth(date);
                          }}
                          month={calendarMonth}
                          onMonthChange={setCalendarMonth}
                          disabled={(date) => date > new Date()}
                          locale={ptBR}
                          className="pointer-events-auto"
                          classNames={{
                            months: "flex flex-col space-y-4",
                            month: "space-y-4",
                            caption: "hidden",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "h-9 w-9 text-center text-sm p-0 relative",
                            day: "h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground rounded-md",
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                          }}
                        />
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blood_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo Sanguíneo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergias</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                  placeholder="Ex: Dipirona"
                  className="flex-1"
                />
                <Button type="button" onClick={addAllergy} variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="pl-2 pr-1">
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="ml-1 hover:bg-destructive-foreground/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chronic_conditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condições Crônicas</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                  placeholder="Ex: Diabetes tipo 2"
                  className="flex-1"
                />
                <Button type="button" onClick={addCondition} variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1">
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emergency_contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato de Emergência</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do contato" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergency_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone de Emergência</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações adicionais sobre o idoso..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Salvando..." : "Salvar Perfil"}
        </Button>
      </form>
    </Form>
  );
};
