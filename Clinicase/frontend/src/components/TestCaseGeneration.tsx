import { useState } from "react";
import { Play, Download, Eye, Settings, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface TestCase {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  compliance: string[];
  steps: string[];
  expectedResults: string[];
}

export const TestCaseGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [generateDatasets, setGenerateDatasets] = useState(true);
  const [includeTraceability, setIncludeTraceability] = useState(true);
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>([]);
  const [generatedTestCases, setGeneratedTestCases] = useState<TestCase[]>([]);
  const { toast } = useToast();

  const mockDocuments = [
    "FDA_Requirements_v2.pdf",
    "IEC_62304_Specs.docx", 
    "ISO_13485_Guidelines.xml",
    "User_Requirements_v1.2.md",
  ];

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentSelect = (document: string) => {
    setSelectedDocuments(prev => 
      prev.includes(document) 
        ? prev.filter(d => d !== document)
        : [...prev, document]
    );
  };

  const handleComplianceChange = (standardId: string, checked: boolean) => {
    setSelectedCompliance(prev => 
      checked 
        ? [...prev, standardId]
        : prev.filter(id => id !== standardId)
    );
  };

  const handleGenerateTestCases = async () => {
    if (!requirements.trim() && selectedDocuments.length === 0 && uploadedFiles.length === 0) {
      toast({
        title: "Input required",
        description: "Please provide requirements, select documents, or upload files.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockTestCases: TestCase[] = [
        {
          id: "TC001",
          title: "User Authentication Validation",
          description: "Verify that the system properly authenticates healthcare users according to FDA guidelines",
          category: "Security",
          priority: "High",
          compliance: ["FDA 21 CFR Part 820", "ISO 27001"],
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
          ]
        },
        {
          id: "TC002",
          title: "Patient Data Privacy Compliance",
          description: "Ensure patient data handling meets GDPR and HIPAA requirements",
          category: "Privacy",
          priority: "High",
          compliance: ["GDPR", "HIPAA", "ISO 13485"],
          steps: [
            "Access patient data module",
            "Attempt to view restricted information",
            "Verify access controls",
            "Test data encryption"
          ],
          expectedResults: [
            "Only authorized users can access data",
            "Data is encrypted in transit and at rest",
            "Access attempts are logged",
            "Privacy controls are enforced"
          ]
        },
        {
          id: "TC003",
          title: "Medical Device Integration Safety",
          description: "Validate safe integration with medical devices per IEC 62304 standards",
          category: "Integration",
          priority: "Medium",
          compliance: ["IEC 62304", "ISO 14155"],
          steps: [
            "Connect to medical device",
            "Initiate data transfer",
            "Verify data integrity",
            "Test error handling"
          ],
          expectedResults: [
            "Device connects successfully",
            "Data transfer is secure and accurate",
            "Error conditions are handled gracefully",
            "Safety alarms function correctly"
          ]
        }
      ];

      setGeneratedTestCases(mockTestCases);
      setIsGenerating(false);
      
      toast({
        title: "Test cases generated!",
        description: `Successfully generated ${mockTestCases.length} compliant test cases.`,
      });
    }, 3000);
  };

  const exportTestCases = () => {
    toast({
      title: "Export initiated",
      description: "Test cases are being exported to your selected format.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AI Test Case Generation</span>
          </CardTitle>
          <CardDescription>
            Generate comprehensive, compliant test cases from your healthcare requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Selection & Upload */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Source Documents</Label>
                <div className="space-y-2">
                  {mockDocuments.map((doc) => (
                    <div key={doc} className="flex items-center space-x-2">
                      <Checkbox
                        id={doc}
                        checked={selectedDocuments.includes(doc)}
                        onCheckedChange={(checked) => handleDocumentSelect(doc)}
                      />
                      <Label htmlFor={doc} className="text-sm font-normal">{doc}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Additional Documents</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.xml,.md,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, XML, MD files
                    </p>
                  </Label>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Compliance Standards */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Compliance Standards</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
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
              </div>

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

          <div className="flex space-x-3">
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
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Test Cases */}
      {generatedTestCases.length > 0 && (
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
                <Button variant="outline" size="sm" onClick={exportTestCases}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Options */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Export & Integration</CardTitle>
          <CardDescription>
            Export test cases or integrate directly with your ALM tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto flex-col p-4">
              <div className="text-2xl mb-2">🔗</div>
              <span className="font-medium">Jira Integration</span>
              <span className="text-xs text-muted-foreground">Export to Jira tickets</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col p-4">
              <div className="text-2xl mb-2">📊</div>
              <span className="font-medium">Polarion</span>
              <span className="text-xs text-muted-foreground">Sync with Polarion ALM</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col p-4">
              <div className="text-2xl mb-2">⚡</div>
              <span className="font-medium">Azure DevOps</span>
              <span className="text-xs text-muted-foreground">Push to Azure pipelines</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};