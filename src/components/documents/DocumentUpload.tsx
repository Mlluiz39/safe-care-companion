import { useRef, useState } from "react";
import { Upload, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number;
}

export const DocumentUpload = ({ 
  onUpload, 
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 10 * 1024 * 1024 // 10MB
}: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (file.size > maxSize) {
      alert(`Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simular progresso
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onUpload(file);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          uploading && "pointer-events-none opacity-60"
        )}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <Upload className="w-12 h-12 text-primary animate-pulse" />
              <div className="w-full max-w-xs">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div>
                <p className="font-semibold mb-1">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, JPG ou PNG até {maxSize / 1024 / 1024}MB
                </p>
              </div>
              <Button variant="secondary" size="sm" type="button">
                Selecionar Arquivo
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
