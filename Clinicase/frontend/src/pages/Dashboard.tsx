import { useState } from "react";
import { Upload, FileText, Shield, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/FileUpload";
import { TestCaseGeneration } from "@/components/TestCaseGeneration";
import { CompliancePanel } from "@/components/CompliancePanel";
import { Navigation } from "@/components/Navigation";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upload");

  const stats = [
    {
      title: "Documents Processed",
      value: "127",
      change: "+12%",
      icon: FileText,
      color: "text-info",
    },
    {
      title: "Test Cases Generated",
      value: "2,394",
      change: "+23%",
      icon: Target,
      color: "text-success",
    },
    {
      title: "Compliance Score",
      value: "98.5%",
      change: "+2.1%",
      icon: Shield,
      color: "text-primary",
    },
    {
      title: "Processing Speed",
      value: "3.2s",
      change: "-15%",
      icon: Zap,
      color: "text-warning",
    },
  ];

  const recentFiles = [
    { name: "FDA_Requirements_v2.pdf", type: "PDF", status: "Processed", cases: 45 },
    { name: "IEC_62304_Specs.docx", type: "Word", status: "Processing", cases: 0 },
    { name: "ISO_13485_Guidelines.xml", type: "XML", status: "Queued", cases: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navigation variant="dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload & Processing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-secondary rounded-lg p-1">
              <Button
                variant={activeTab === "upload" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("upload")}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
              <Button
                variant={activeTab === "generate" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("generate")}
                className="flex-1"
              >
                <Target className="w-4 h-4 mr-2" />
                Generate Tests
              </Button>
            </div>

            {/* Tab Content */}
            {activeTab === "upload" && <FileUpload />}
            {activeTab === "generate" && <TestCaseGeneration />}

            {/* Recent Files */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>
                  Your recently processed healthcare specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{file.type} Document</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            file.status === "Processed"
                              ? "default"
                              : file.status === "Processing"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {file.status}
                        </Badge>
                        {file.cases > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {file.cases} test cases
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Compliance & Tools */}
          <div className="space-y-6">
            <CompliancePanel />

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.312-.623-.312-1.544c0-1.448.839-2.529 1.884-2.529.888 0 1.319.664 1.319 1.459 0 .888-.565 2.214-.854 3.440-.243 1.028.514 1.862 1.524 1.862 1.83 0 3.24-1.93 3.24-4.715 0-2.467-1.774-4.192-4.309-4.192-2.939 0-4.671 2.203-4.671 4.482 0 .887.341 1.838.766 2.357.084.099.096.186.071.288-.077.323-.25 1.018-.284 1.162-.045.186-.145.225-.334.135-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.97-.527-2.297-1.155l-.624 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017 0z"/>
                  </svg>
                  Connect to Jira
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h11v16H0V0zm13 0h11v16H13V0z"/>
                  </svg>
                  Export to Polarion
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 12l1.1.5c5.7 2.5 12.8 2.5 18.5 0L21 12l-1.1-.5c-5.7-2.5-12.8-2.5-18.5 0L0 12z"/>
                  </svg>
                  Sync with Azure DevOps
                </Button>
              </CardContent>
            </Card>

            {/* Processing Queue */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Processing Queue</CardTitle>
                <CardDescription>Current AI processing status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>IEC_62304_Specs.docx</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ISO_Guidelines.xml</span>
                    <span>Queued</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
