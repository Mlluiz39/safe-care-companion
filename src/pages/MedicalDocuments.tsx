import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, ArrowLeft, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DocumentUpload } from '@/components/documents/DocumentUpload'
import { DocumentCard } from '@/components/documents/DocumentCard'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

interface Document {
  id: string
  title: string
  document_type: string
  document_date?: string
  file_path: string
  mime_type?: string
  file_size?: number
  notes?: string
  created_at: string
  family_member_id: string
  family_member?: {
    full_name: string
  }
}

interface FamilyMember {
  id: string
  full_name: string
}

const MedicalDocuments = () => {
  const [user, setUser] = useState<User | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [documentType, setDocumentType] = useState('exam')
  const [documentDate, setDocumentDate] = useState<Date>()
  const [familyMemberId, setFamilyMemberId] = useState('')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      navigate('/auth')
      return
    }
    setUser(session.user)
    loadFamilyMembers()
    loadDocuments()
  }

  const loadFamilyMembers = async () => {
    const { data, error } = await supabase
      .from('family_members')
      .select('id, full_name')
      .order('full_name')

    if (error) {
      toast({
        title: 'Erro ao carregar membros',
        description: error.message,
        variant: 'destructive',
      })
      return
    }

    setFamilyMembers(data || [])
  }

  const loadDocuments = async () => {
    const { data, error } = await supabase
      .from('medical_documents')
      .select(
        `
        *,
        family_member:family_members(full_name)
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: 'Erro ao carregar documentos',
        description: error.message,
        variant: 'destructive',
      })
      return
    }

    setDocuments(data || [])
  }

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setTitle(file.name.replace(/\.[^/.]+$/, ''))
  }

  const handleUpload = async () => {
    if (!selectedFile || !title || !familyMemberId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha título e selecione o paciente',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)

    try {
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`
      const filePath = `${familyMemberId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('medical_documents')
        .insert([
          {
            family_member_id: familyMemberId,
            title,
            document_type: documentType,
            document_date: documentDate?.toISOString().split('T')[0],
            file_path: filePath,
            mime_type: selectedFile.type,
            file_size: selectedFile.size,
            notes: notes || null,
            uploaded_by: user?.id,
          },
        ])

      if (dbError) throw dbError

      toast({
        title: 'Sucesso!',
        description: 'Documento enviado com sucesso',
      })

      setIsUploadOpen(false)
      resetForm()
      loadDocuments()
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao enviar o documento.'

      toast({
        title: 'Erro ao enviar documento',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setTitle('')
    setDocumentType('exam')
    setDocumentDate(undefined)
    setFamilyMemberId('')
    setNotes('')
  }

  const handleView = async (document: Document) => {
    const { data } = await supabase.storage
      .from('medical-documents')
      .createSignedUrl(document.file_path, 3600)

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  }

  const handleDownload = async (document: Document) => {
    const { data } = await supabase.storage
      .from('medical-documents')
      .download(document.file_path)

    if (data) {
      const url = URL.createObjectURL(data)
      const a = window.document.createElement('a')
      a.href = url
      a.download = document.title
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleDelete = async (document: Document) => {
    await supabase.storage
      .from('medical-documents')
      .remove([document.file_path])

    const { error } = await supabase
      .from('medical_documents')
      .delete()
      .eq('id', document.id)

    if (error) {
      toast({
        title: 'Erro ao deletar documento',
        description: error.message,
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Documento deletado',
      description: 'O documento foi removido com sucesso',
    })

    loadDocuments()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-accent shrink-0" />
              <h1 className="text-sm sm:text-xl font-bold truncate">
                Documentos Médicos
              </h1>
            </div>
          </div>
          <Button
            onClick={() => setIsUploadOpen(true)}
            size="sm"
            className="shrink-0"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Enviar</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Nenhum documento cadastrado
            </h2>
            <p className="text-muted-foreground mb-6">
              Envie o primeiro exame ou documento médico
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Enviar Documento
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {documents.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={() => handleView(doc)}
                onDownload={() => handleDownload(doc)}
                onDelete={() => handleDelete(doc)}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enviar Documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <DocumentUpload onUpload={handleFileSelect} />

            {selectedFile && (
              <>
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ex: Hemograma completo"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Documento</Label>
                    <Select
                      value={documentType}
                      onValueChange={setDocumentType}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exam">Exame</SelectItem>
                        <SelectItem value="prescription">Receita</SelectItem>
                        <SelectItem value="report">Relatório</SelectItem>
                        <SelectItem value="imaging">Imagem</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Paciente</Label>
                    <Select
                      value={familyMemberId}
                      onValueChange={setFamilyMemberId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {familyMembers.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Data do Documento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !documentDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {documentDate
                          ? format(documentDate, 'dd/MM/yyyy')
                          : 'Selecione a data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={documentDate}
                        onSelect={setDocumentDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Observações (Opcional)</Label>
                  <Textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Notas adicionais sobre o documento..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? 'Enviando...' : 'Enviar Documento'}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MedicalDocuments
