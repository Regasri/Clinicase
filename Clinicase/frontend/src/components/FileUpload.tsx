import { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "processing" | "completed" | "error";
  progress: number;
}

export const FileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload and processing
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });

    toast({
      title: "Files added",
      description: `${newFiles.length} file(s) added to processing queue.`,
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          if (file.progress < 100) {
            return { ...file, progress: file.progress + 10 };
          } else if (file.status === "uploading") {
            return { ...file, status: "processing" };
          } else if (file.status === "processing") {
            return { ...file, status: "completed" };
          }
        }
        return file;
      }));
    }, 500);

    setTimeout(() => clearInterval(interval), 6000);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading": return "secondary";
      case "uploaded": return "secondary";
      case "processing": return "default";
      case "completed": return "default";
      case "error": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Upload Healthcare Documents</CardTitle>
          <CardDescription>
            Upload requirements, specifications, and regulatory documents for AI-powered test case generation.
            Supports PDF, Word, XML, and Markdown formats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drag and drop files here</h3>
            <p className="text-muted-foreground mb-4">
              Or click to browse and select files from your computer
            </p>
            <Button
              onClick={() => document.getElementById("file-input")?.click()}
              className="bg-gradient-primary"
            >
              Browse Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xml,.md,.txt"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            <div className="mt-4 text-xs text-muted-foreground">
              Supported formats: PDF, Word (.doc, .docx), XML, Markdown (.md), Text (.txt)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>
              Track the progress of your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      {file.status === "completed" && (
                        <CheckCircle className="h-4 w-4 text-success absolute -top-1 -right-1 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <Badge variant={getStatusColor(file.status)} className="text-xs">
                          {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                        </Badge>
                      </div>
                      {file.status === "uploading" && (
                        <div className="mt-2">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supported Standards */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Compliance Standards Supported</CardTitle>
          <CardDescription>
            Our AI automatically ensures compliance with healthcare regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "FDA 21 CFR Part 820",
              "IEC 62304",
              "ISO 9001",
              "ISO 13485",
              "ISO 27001",
              "GDPR Compliant",
            ].map((standard) => (
              <Badge key={standard} variant="outline" className="justify-center py-2">
                {standard}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};