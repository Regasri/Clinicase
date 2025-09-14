import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Settings, Cloud, TestTube, AlertCircle } from "lucide-react";

const AzureDevOpsIntegration = () => {
  const [config, setConfig] = useState({
    organization: "healthtech",
    project: "healthcare-platform",
    personalAccessToken: "",
    workItemType: "Test Case"
  });

  const [isConnected, setIsConnected] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      setIsConnected(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/settings" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Cloud className="h-8 w-8 text-blue-500" />
              Azure DevOps Integration
            </h1>
            <p className="text-muted-foreground">
              Connect to Azure DevOps for seamless test case and work item management
            </p>
          </div>
        </div>

        {isConnected && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully connected to Azure DevOps! Test cases can now be synchronized with your project.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="workitems" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Work Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Azure DevOps Configuration</CardTitle>
                  <CardDescription>
                    Configure your Azure DevOps organization and project settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        placeholder="your-organization"
                        value={config.organization}
                        onChange={(e) => setConfig({...config, organization: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">
                        From https://dev.azure.com/your-organization
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project">Project</Label>
                      <Input
                        id="project"
                        placeholder="your-project-name"
                        value={config.project}
                        onChange={(e) => setConfig({...config, project: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pat">Personal Access Token</Label>
                    <Input
                      id="pat"
                      type="password"
                      placeholder="Enter your PAT"
                      value={config.personalAccessToken}
                      onChange={(e) => setConfig({...config, personalAccessToken: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Create a PAT with Work Items (read & write) permissions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workItemType">Default Work Item Type</Label>
                    <Select value={config.workItemType} onValueChange={(value) => setConfig({...config, workItemType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work item type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Test Case">Test Case</SelectItem>
                        <SelectItem value="Test Suite">Test Suite</SelectItem>
                        <SelectItem value="Test Plan">Test Plan</SelectItem>
                        <SelectItem value="User Story">User Story</SelectItem>
                        <SelectItem value="Task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleTestConnection} 
                      disabled={testingConnection}
                      className="w-fit"
                    >
                      {testingConnection ? "Testing..." : "Test Connection"}
                    </Button>
                    {isConnected && (
                      <Button variant="outline" className="w-fit">
                        Save Configuration
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Capabilities</CardTitle>
                  <CardDescription>
                    What you can do with Azure DevOps integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Create test cases and test suites automatically</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Link test cases to user stories and requirements</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Execute test runs and track results</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Generate test reports and metrics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Maintain traceability across artifacts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workitems">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Work Item Synchronization</CardTitle>
                  <CardDescription>
                    Manage synchronization between AI-generated test cases and Azure DevOps work items
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isConnected ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please configure and test your Azure DevOps connection first to enable work item synchronization.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-primary">203</div>
                          <div className="text-sm text-muted-foreground">Test Cases</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-success">45</div>
                          <div className="text-sm text-muted-foreground">Test Suites</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-info">12</div>
                          <div className="text-sm text-muted-foreground">Test Plans</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-warning">8</div>
                          <div className="text-sm text-muted-foreground">Pending Sync</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Recent Activity</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">User Authentication Test Suite</div>
                              <div className="text-sm text-muted-foreground">Test Suite #1245 • 15 test cases</div>
                            </div>
                            <Badge variant="outline" className="text-success border-success">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">Data Validation Tests</div>
                              <div className="text-sm text-muted-foreground">Test Case #1246 • Linked to US-789</div>
                            </div>
                            <Badge variant="outline" className="text-info border-info">In Progress</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">API Integration Test Plan</div>
                              <div className="text-sm text-muted-foreground">Test Plan #TP-001 • 8 test suites</div>
                            </div>
                            <Badge variant="outline" className="text-warning border-warning">Draft</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="w-fit">Sync All Work Items</Button>
                        <Button variant="outline" className="w-fit">Create Test Plan</Button>
                        <Button variant="outline" className="w-fit">View Test Reports</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AzureDevOpsIntegration;
