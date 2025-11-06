import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Image as ImageIcon, Download, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  title: string;
  document_type: string;
  document_date?: string;
  file_path: string;
  mime_type?: string;
  file_size?: number;
  notes?: string;
  created_at: string;
  family_member?: {
    full_name: string;
  };
}

interface DocumentCardProps {
  document: Document;
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

const typeLabels: Record<string, string> = {
  exam: "Exame",
  prescription: "Receita",
  report: "Relatório",
  imaging: "Imagem",
  other: "Outro",
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const DocumentCard = ({ document, onView, onDownload, onDelete }: DocumentCardProps) => {
  const isImage = document.mime_type?.startsWith("image/");
  const isPdf = document.mime_type === "application/pdf";

  return (
    <Card className="p-6 bg-[var(--gradient-card)] hover:shadow-[var(--shadow-medium)] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isImage ? "bg-accent/10" : "bg-primary/10"
          }`}>
            {isImage ? (
              <ImageIcon className="w-6 h-6 text-accent" />
            ) : (
              <FileText className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold line-clamp-1">{document.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(document.file_size)}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onView}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDownload}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Badge variant="secondary">{typeLabels[document.document_type] || document.document_type}</Badge>
          {document.family_member && (
            <Badge variant="outline">{document.family_member.full_name}</Badge>
          )}
        </div>

        {document.document_date && (
          <p className="text-sm text-muted-foreground">
            Data: {format(new Date(document.document_date), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Enviado em: {format(new Date(document.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </p>

        {document.notes && (
          <p className="text-sm pt-2 border-t line-clamp-2">{document.notes}</p>
        )}
      </div>
    </Card>
  );
};
