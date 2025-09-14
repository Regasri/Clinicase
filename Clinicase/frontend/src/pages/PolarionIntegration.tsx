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
import { ArrowLeft, CheckCircle, Settings, Zap, TestTube, AlertCircle, Shield } from "lucide-react";

const PolarionIntegration = () => {
  const [config, setConfig] = useState({
    serverUrl: "https://polarion.company.com/polarion",
    username: "",
    password: "",
    project: "HealthcarePlatform",
    workItemType: "testcase"
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
              <Zap className="h-8 w-8 text-purple-600" />
              Polarion Integration
            </h1>
            <p className="text-muted-foreground">
              Connect to Polarion ALM for comprehensive requirements and test management
            </p>
          </div>
        </div>

        {isConnected && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully connected to Polarion! Test cases and requirements are now synchronized.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="requirements" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Requirements
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Polarion Server Configuration</CardTitle>
                  <CardDescription>
                    Configure connection to your Polarion ALM server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="serverUrl">Polarion Server URL</Label>
                    <Input
                      id="serverUrl"
                      placeholder="https://polarion.company.com/polarion"
                      value={config.serverUrl}
                      onChange={(e) => setConfig({...config, serverUrl: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="your.username"
                        value={config.username}
                        onChange={(e) => setConfig({...config, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={config.password}
                        onChange={(e) => setConfig({...config, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project">Project ID</Label>
                      <Input
                        id="project"
                        placeholder="HealthcarePlatform"
                        value={config.project}
                        onChange={(e) => setConfig({...config, project: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workItemType">Work Item Type</Label>
                      <Select value={config.workItemType} onValueChange={(value) => setConfig({...config, workItemType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="testcase">Test Case</SelectItem>
                          <SelectItem value="testsuite">Test Suite</SelectItem>
                          <SelectItem value="testrun">Test Run</SelectItem>
                          <SelectItem value="requirement">Requirement</SelectItem>
                          <SelectItem value="workitem">Work Item</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                  <CardTitle>Polarion Integration Features</CardTitle>
                  <CardDescription>
                    Advanced ALM capabilities with Polarion integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Bidirectional requirement-to-test traceability</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Automated test case generation from requirements</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Live Link integration with documents</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Test execution and result tracking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Compliance reporting and audit trails</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Risk-based testing prioritization</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requirements">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements Management</CardTitle>
                  <CardDescription>
                    Manage requirements and their traceability to test cases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isConnected ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please configure and test your Polarion connection first to access requirements management.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-primary">342</div>
                          <div className="text-sm text-muted-foreground">Requirements</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-success">289</div>
                          <div className="text-sm text-muted-foreground">Test Cases</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-info">95%</div>
                          <div className="text-sm text-muted-foreground">Coverage</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-warning">18</div>
                          <div className="text-sm text-muted-foreground">Gaps</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Recent Requirements Activity</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">REQ-AUTH-001: User Authentication</div>
                              <div className="text-sm text-muted-foreground">Linked to 12 test cases • Last updated 2 days ago</div>
                            </div>
                            <Badge variant="outline" className="text-success border-success">Verified</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">REQ-DATA-003: Patient Data Encryption</div>
                              <div className="text-sm text-muted-foreground">Linked to 8 test cases • Compliance: IEC 62304</div>
                            </div>
                            <Badge variant="outline" className="text-info border-info">In Review</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">REQ-API-007: FHIR Integration</div>
                              <div className="text-sm text-muted-foreground">No test cases linked • Needs coverage</div>
                            </div>
                            <Badge variant="outline" className="text-warning border-warning">Gap</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="w-fit">Generate Missing Test Cases</Button>
                        <Button variant="outline" className="w-fit">Traceability Matrix</Button>
                        <Button variant="outline" className="w-fit">Coverage Report</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Management</CardTitle>
                  <CardDescription>
                    Monitor compliance status and generate regulatory reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isConnected ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please configure your Polarion connection to access compliance management features.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">FDA 21 CFR Part 820</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-success">98%</span>
                              <Badge variant="outline" className="text-success border-success">Compliant</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">Last audit: 5 days ago</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">IEC 62304</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-warning">85%</span>
                              <Badge variant="outline" className="text-warning border-warning">Review Needed</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">3 items need attention</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Compliance Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 border rounded">
                              <div className="text-lg font-bold text-success">156</div>
                              <div className="text-sm text-muted-foreground">Passed Tests</div>
                            </div>
                            <div className="p-3 border rounded">
                              <div className="text-lg font-bold text-warning">12</div>
                              <div className="text-sm text-muted-foreground">Pending Review</div>
                            </div>
                            <div className="p-3 border rounded">
                              <div className="text-lg font-bold text-destructive">3</div>
                              <div className="text-sm text-muted-foreground">Failed Tests</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-3">
                        <h4 className="font-medium">Compliance Actions Required</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-lg border-warning/20 bg-warning/5">
                            <div>
                              <div className="font-medium">Risk Analysis Documentation</div>
                              <div className="text-sm text-muted-foreground">IEC 62304 Section 7.1 - Risk management file update required</div>
                            </div>
                            <Badge variant="outline" className="text-warning border-warning">Action Required</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg border-info/20 bg-info/5">
                            <div>
                              <div className="font-medium">Verification Testing</div>
                              <div className="text-sm text-muted-foreground">FDA 21 CFR Part 820 - Additional verification tests recommended</div>
                            </div>
                            <Badge variant="outline" className="text-info border-info">Recommended</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="w-fit">Generate Compliance Report</Button>
                        <Button variant="outline" className="w-fit">Export Audit Trail</Button>
                        <Button variant="outline" className="w-fit">Schedule Review</Button>
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

export default PolarionIntegration;