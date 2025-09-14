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
import { ArrowLeft, CheckCircle, Settings, Database, TestTube, AlertCircle } from "lucide-react";

const JiraIntegration = () => {
  const [config, setConfig] = useState({
    serverUrl: "https://company.atlassian.net",
    apiToken: "",
    username: "john.doe@company.com",
    projectKey: "HEALTH"
  });

  const [isConnected, setIsConnected] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    // Simulate API call
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
              <Database className="h-8 w-8 text-blue-600" />
              Jira Integration
            </h1>
            <p className="text-muted-foreground">
              Connect your Jira instance to sync test cases and requirements
            </p>
          </div>
        </div>

        {isConnected && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully connected to Jira! You can now sync test cases and track requirements.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test Cases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Configuration</CardTitle>
                  <CardDescription>
                    Configure your Jira server connection and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="serverUrl">Jira Server URL</Label>
                    <Input
                      id="serverUrl"
                      placeholder="https://company.atlassian.net"
                      value={config.serverUrl}
                      onChange={(e) => setConfig({...config, serverUrl: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username/Email</Label>
                      <Input
                        id="username"
                        type="email"
                        placeholder="your.email@company.com"
                        value={config.username}
                        onChange={(e) => setConfig({...config, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiToken">API Token</Label>
                      <Input
                        id="apiToken"
                        type="password"
                        placeholder="Enter your API token"
                        value={config.apiToken}
                        onChange={(e) => setConfig({...config, apiToken: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectKey">Default Project Key</Label>
                    <Input
                      id="projectKey"
                      placeholder="HEALTH"
                      value={config.projectKey}
                      onChange={(e) => setConfig({...config, projectKey: e.target.value})}
                    />
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
                  <CardTitle>Integration Features</CardTitle>
                  <CardDescription>
                    Available features once connected to Jira
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Automatic test case creation from requirements</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Bidirectional sync of test execution results</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Traceability matrix generation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Compliance reporting integration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sync">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Case Synchronization</CardTitle>
                  <CardDescription>
                    Manage test case sync between AI generation and Jira
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isConnected ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please configure and test your Jira connection first to enable test case synchronization.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-primary">156</div>
                          <div className="text-sm text-muted-foreground">Total Test Cases</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-success">89</div>
                          <div className="text-sm text-muted-foreground">Synced to Jira</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-warning">12</div>
                          <div className="text-sm text-muted-foreground">Pending Sync</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Recent Sync Activity</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">Login Authentication Tests</div>
                              <div className="text-sm text-muted-foreground">Generated from REQ-AUTH-001</div>
                            </div>
                            <Badge variant="outline" className="text-success border-success">Synced</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">Patient Data Validation</div>
                              <div className="text-sm text-muted-foreground">Generated from REQ-DATA-003</div>
                            </div>
                            <Badge variant="outline" className="text-warning border-warning">Pending</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="w-fit">Sync All Test Cases</Button>
                        <Button variant="outline" className="w-fit">Generate Traceability Report</Button>
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

export default JiraIntegration;