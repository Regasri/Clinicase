import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle, Play, Download, Eye, Settings, Sparkles, ChevronRight, MessageSquare, ThumbsUp, ThumbsDown, Star, HelpCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "uploaded" | "processing" | "completed" | "error";
  progress: number;
  analysisResults?: {
    compliance: string[];
    categories: string[];
    requirementCount: number;
  };
}

interface TestCase {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  compliance: string[];
  steps: string[];
  expectedResults: string[];
  sourceDocument: string;
  feedback?: {
    rating: number;
    comments: string;
    approved: boolean;
  };
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sourceDocument: string;
}

type WorkflowStep = "upload" | "analyze" | "generate" | "review";

export const UnifiedWorkflow = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>([]);
  const [generateDatasets, setGenerateDatasets] = useState(true);
  const [includeTraceability, setIncludeTraceability] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTestCases, setGeneratedTestCases] = useState<TestCase[]>([]);
  const [generatedFAQs, setGeneratedFAQs] = useState<FAQ[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const complianceStandards = [
    { id: "fda", label: "FDA 21 CFR Part 820" },
    { id: "iso13485", label: "ISO 13485" },
    { id: "iso14971", label: "ISO 14971" },
    { id: "iec62304", label: "IEC 62304" },
    { id: "gdpr", label: "GDPR" },
    { id: "hipaa", label: "HIPAA" },
    { id: "iso27001", label: "ISO 27001" },
    { id: "iso14155", label: "ISO 14155" }
  ];

  const getStepProgress = () => {
    const steps = ["upload", "analyze", "generate", "review"];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case "upload":
        return files.some(f => f.status === "completed");
      case "analyze":
        return files.some(f => f.analysisResults);
      case "generate":
        return generatedTestCases.length > 0;
      default:
        return false;
    }
  };

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
            return { ...file, progress: file.progress + 15 };
          } else if (file.status === "uploading") {
            return { ...file, status: "processing" };
          } else if (file.status === "processing") {
            // Add mock analysis results
            return { 
              ...file, 
              status: "completed",
              analysisResults: {
                compliance: ["FDA 21 CFR Part 820", "ISO 13485"],
                categories: ["Security", "Validation", "Integration"],
                requirementCount: Math.floor(Math.random() * 50) + 10
              }
            };
          }
        }
        return file;
      }));
    }, 400);

    setTimeout(() => clearInterval(interval), 3000);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleComplianceChange = (standardId: string, checked: boolean) => {
    setSelectedCompliance(prev => 
      checked 
        ? [...prev, standardId]
        : prev.filter(id => id !== standardId)
    );
  };

  const handleGenerateTestCases = async () => {
    setIsGenerating(true);

    setTimeout(() => {
      const mockTestCases: TestCase[] = files
        .filter(f => f.status === "completed")
        .flatMap(file => [
          {
            id: `TC${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
            title: `User Authentication Validation - ${file.name}`,
            description: `Verify system authentication based on requirements in ${file.name}`,
            category: "Security",
            priority: "High" as const,
            compliance: file.analysisResults?.compliance || [],
            steps: [
              "Navigate to login page",
              "Enter valid credentials",
              "Verify successful authentication",
              "Check audit trail logging"
            ],
            expectedResults: [
              "User is authenticated successfully",
              "Session is established with proper timeout",
              "Authentication event is logged",
              "User role permissions are applied"
            ],
            sourceDocument: file.name
          },
          {
            id: `TC${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
            title: `Data Privacy Compliance - ${file.name}`,
            description: `Ensure data handling meets compliance standards from ${file.name}`,
            category: "Privacy",
            priority: "High" as const,
            compliance: file.analysisResults?.compliance || [],
            steps: [
              "Access sensitive data module",
              "Attempt to view restricted information",
              "Verify access controls",
              "Test data encryption"
            ],
            expectedResults: [
              "Only authorized users can access data",
              "Data is encrypted in transit and at rest",
              "Access attempts are logged",
              "Privacy controls are enforced"
            ],
            sourceDocument: file.name
          }
        ]);

      const mockFAQs: FAQ[] = files
        .filter(f => f.status === "completed")
        .flatMap(file => [
          {
            id: `FAQ${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
            question: "What are the key authentication requirements for healthcare systems?",
            answer: "Healthcare systems must implement multi-factor authentication, session timeouts, and role-based access controls as per FDA guidelines and HIPAA compliance requirements.",
            category: "Security",
            sourceDocument: file.name
          },
          {
            id: `FAQ${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
            question: "How should patient data be encrypted?",
            answer: "Patient data must be encrypted both in transit using TLS 1.2+ and at rest using AES-256 encryption, with proper key management protocols.",
            category: "Privacy",
            sourceDocument: file.name
          },
          {
            id: `FAQ${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
            question: "What audit logging is required for compliance?",
            answer: "All user actions, data access, modifications, and system events must be logged with timestamps, user identification, and action details for regulatory compliance.",
            category: "Compliance",
            sourceDocument: file.name
          }
        ]);

      setGeneratedTestCases(mockTestCases);
      setGeneratedFAQs(mockFAQs);
      setIsGenerating(false);
      setCurrentStep("review");
      
      toast({
        title: "Test cases and FAQs generated!",
        description: `Successfully generated ${mockTestCases.length} test cases and ${mockFAQs.length} FAQs.`,
      });
    }, 3000);
  };

  const handleTestCaseFeedback = (testCaseId: string, rating: number, comments: string, approved: boolean) => {
    setGeneratedTestCases(prev => prev.map(tc => 
      tc.id === testCaseId 
        ? { ...tc, feedback: { rating, comments, approved } }
        : tc
    ));
    
    toast({
      title: approved ? "Test case approved" : "Feedback recorded",
      description: "Your feedback has been saved.",
    });
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const exportTestCases = () => {
    toast({
      title: "Export initiated",
      description: "Test cases are being exported to your selected format.",
    });
  };

  const stepTitles = {
    upload: "Upload Documents",
    analyze: "Document Analysis",
    generate: "Generate Test Cases",
    review: "Review & Export"
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Healthcare Test Case Generation Workflow</h2>
              <Badge variant="outline" className="px-3 py-1">
                Step {["upload", "analyze", "generate", "review"].indexOf(currentStep) + 1} of 4
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(getStepProgress())}%</span>
              </div>
              <Progress value={getStepProgress()} className="h-2" />
            </div>

            <div className="flex items-center space-x-4 text-sm">
              {(["upload", "analyze", "generate", "review"] as WorkflowStep[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    currentStep === step ? "text-primary font-medium" : 
                    ["upload", "analyze", "generate", "review"].indexOf(currentStep) > index ? "text-muted-foreground" : "text-muted-foreground/50"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      currentStep === step ? "bg-primary" : 
                      ["upload", "analyze", "generate", "review"].indexOf(currentStep) > index ? "bg-success" : "bg-muted-foreground/30"
                    }`} />
                    <span>{stepTitles[step]}</span>
                  </div>
                  {index < 3 && <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50" />}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Upload Documents */}
      {currentStep === "upload" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Healthcare Documents</span>
            </CardTitle>
            <CardDescription>
              Upload requirements, specifications, and regulatory documents for AI-powered analysis and test case generation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {files.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Processing Queue</h4>
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
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
            )}

            {canProceedToNext() && (
              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep("analyze")} className="bg-gradient-primary">
                  Proceed to Analysis <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Document Analysis */}
      {currentStep === "analyze" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Document Analysis Results</span>
            </CardTitle>
            <CardDescription>
              AI analysis of your uploaded documents and detected compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {files.filter(f => f.status === "completed").map((file) => (
              <div key={file.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{file.name}</h4>
                  <Badge variant="default">Analyzed</Badge>
                </div>
                
                {file.analysisResults && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Detected Compliance</h5>
                      <div className="space-y-1">
                        {file.analysisResults.compliance.map((standard) => (
                          <Badge key={standard} variant="outline" className="text-xs block w-fit">
                            {standard}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Test Categories</h5>
                      <div className="space-y-1">
                        {file.analysisResults.categories.map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs block w-fit">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Requirements Found</h5>
                      <p className="text-2xl font-bold text-primary">{file.analysisResults.requirementCount}</p>
                      <p className="text-xs text-muted-foreground">testable requirements</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                Back to Upload
              </Button>
              <Button onClick={() => setCurrentStep("generate")} className="bg-gradient-primary">
                Generate Test Cases <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Generate Test Cases */}
      {currentStep === "generate" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Configure Test Case Generation</span>
            </CardTitle>
            <CardDescription>
              Fine-tune the AI generation process for your specific needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Standards */}
              <div className="space-y-4">
                <Label>Additional Compliance Standards</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                  {complianceStandards.map((standard) => (
                    <div key={standard.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={standard.id}
                        checked={selectedCompliance.includes(standard.id)}
                        onCheckedChange={(checked) => 
                          handleComplianceChange(standard.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={standard.id} className="text-sm font-normal">
                        {standard.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="datasets">Generate Test Datasets</Label>
                    <Switch
                      id="datasets"
                      checked={generateDatasets}
                      onCheckedChange={setGenerateDatasets}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="traceability">Include Requirement Traceability</Label>
                    <Switch
                      id="traceability"
                      checked={includeTraceability}
                      onCheckedChange={setIncludeTraceability}
                    />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements">Additional Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Enter specific requirements or constraints for test case generation..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="h-48"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("analyze")}>
                Back to Analysis
              </Button>
              <Button
                onClick={handleGenerateTestCases}
                disabled={isGenerating}
                className="bg-gradient-primary"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate Test Cases
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Export */}
      {currentStep === "review" && generatedTestCases.length > 0 && (
        <div className="space-y-6">
          {/* Test Cases Review */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Test Cases</CardTitle>
                  <CardDescription>
                    AI-generated test cases with full compliance traceability
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/export")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedTestCases.map((testCase) => (
                  <div key={testCase.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{testCase.id}</Badge>
                          <Badge variant={getPriorityColor(testCase.priority)}>
                            {testCase.priority} Priority
                          </Badge>
                          <Badge variant="secondary">{testCase.category}</Badge>
                          <Badge variant="outline" className="text-xs">
                            Source: {testCase.sourceDocument}
                          </Badge>
                          {testCase.feedback?.approved && (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg">{testCase.title}</h3>
                        <p className="text-muted-foreground">{testCase.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Test Steps</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          {testCase.steps.map((step, index) => (
                            <li key={index} className="text-muted-foreground">{step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Expected Results</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {testCase.expectedResults.map((result, index) => (
                            <li key={index} className="text-muted-foreground">{result}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Compliance Standards</h4>
                      <div className="flex flex-wrap gap-2">
                        {testCase.compliance.map((standard) => (
                          <Badge key={standard} variant="outline" className="text-xs">
                            {standard}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Review & Feedback</h4>
                        {testCase.feedback?.rating && (
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= testCase.feedback!.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestCaseFeedback(testCase.id, 5, "", true)}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestCaseFeedback(testCase.id, 2, "Needs revision", false)}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsDown className="h-3 w-3" />
                          <span>Request Changes</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center space-x-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>Add Comment</span>
                        </Button>
                      </div>
                      
                      {testCase.feedback?.comments && (
                        <div className="text-sm text-muted-foreground bg-background rounded p-2">
                          <strong>Comments:</strong> {testCase.feedback.comments}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          {generatedFAQs.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span>Document-Based FAQs</span>
                </CardTitle>
                <CardDescription>
                  Automatically generated FAQs based on your uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {generatedFAQs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-muted-foreground">{faq.answer}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>Source: {faq.sourceDocument}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep("generate")}>
              Back to Generation
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                Start New Workflow
              </Button>
              <Button className="bg-gradient-primary" onClick={() => navigate("/export")}>
                <Download className="h-4 w-4 mr-2" />
                Export & Configure
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Integration Options - Always visible */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Export & Integration</CardTitle>
          <CardDescription>
            Export test cases or integrate directly with your ALM tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col p-4"
              onClick={() => navigate("/integrations/jira")}
            >
              <div className="text-2xl mb-2">🔗</div>
              <span className="font-medium">Jira Integration</span>
              <span className="text-xs text-muted-foreground">Configure & export to Jira</span>
              <ExternalLink className="h-3 w-3 mt-1 opacity-50" />
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col p-4"
              onClick={() => navigate("/integrations/polarion")}
            >
              <div className="text-2xl mb-2">📊</div>
              <span className="font-medium">Polarion</span>
              <span className="text-xs text-muted-foreground">Configure & sync with Polarion ALM</span>
              <ExternalLink className="h-3 w-3 mt-1 opacity-50" />
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col p-4"
              onClick={() => navigate("/integrations/azure-devops")}
            >
              <div className="text-2xl mb-2">⚡</div>
              <span className="font-medium">Azure DevOps</span>
              <span className="text-xs text-muted-foreground">Configure & push to Azure</span>
              <ExternalLink className="h-3 w-3 mt-1 opacity-50" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};