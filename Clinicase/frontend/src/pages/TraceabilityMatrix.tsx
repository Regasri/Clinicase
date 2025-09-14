import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Filter, Eye } from "lucide-react";

interface TraceabilityItem {
  requirementId: string;
  requirement: string;
  testCases: string[];
  compliance: string[];
  status: "Covered" | "Partial" | "Not Covered";
}

const TraceabilityMatrix = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const traceabilityData: TraceabilityItem[] = [
    {
      requirementId: "REQ-001",
      requirement: "User authentication must comply with FDA 21 CFR Part 820",
      testCases: ["TC001", "TC004", "TC007"],
      compliance: ["FDA 21 CFR Part 820", "ISO 27001"],
      status: "Covered"
    },
    {
      requirementId: "REQ-002", 
      requirement: "Patient data encryption in transit and at rest",
      testCases: ["TC002", "TC005"],
      compliance: ["GDPR", "HIPAA"],
      status: "Covered"
    },
    {
      requirementId: "REQ-003",
      requirement: "Medical device integration safety protocols",
      testCases: ["TC003"],
      compliance: ["IEC 62304"],
      status: "Partial"
    },
    {
      requirementId: "REQ-004",
      requirement: "Audit trail logging for all user actions",
      testCases: [],
      compliance: ["FDA 21 CFR Part 820"],
      status: "Not Covered"
    },
    {
      requirementId: "REQ-005",
      requirement: "Risk management documentation per ISO 14971",
      testCases: ["TC006"],
      compliance: ["ISO 14971", "IEC 62304"],
      status: "Partial"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Covered": return "default";
      case "Partial": return "outline";
      case "Not Covered": return "destructive";
      default: return "secondary";
    }
  };

  const filteredData = traceabilityData.filter(item => {
    const matchesSearch = item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.requirementId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation variant="dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Traceability Matrix</h1>
              <p className="text-muted-foreground">
                Track requirement coverage and test case relationships
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Matrix
              </Button>
              <Button>
                <Eye className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requirements or IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by coverage status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Covered">Covered</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Not Covered">Not Covered</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Traceability Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Requirements Traceability</CardTitle>
                  <CardDescription>
                    Showing {filteredData.length} of {traceabilityData.length} requirements
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="default">{traceabilityData.filter(i => i.status === "Covered").length} Covered</Badge>
                  <Badge variant="outline">{traceabilityData.filter(i => i.status === "Partial").length} Partial</Badge>
                  <Badge variant="destructive">{traceabilityData.filter(i => i.status === "Not Covered").length} Gaps</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requirement ID</TableHead>
                      <TableHead>Requirement Description</TableHead>
                      <TableHead>Test Cases</TableHead>
                      <TableHead>Compliance Standards</TableHead>
                      <TableHead>Coverage Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.requirementId}>
                        <TableCell className="font-medium">
                          {item.requirementId}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate" title={item.requirement}>
                            {item.requirement}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.testCases.length > 0 ? (
                              item.testCases.map((tc) => (
                                <Badge key={tc} variant="secondary" className="text-xs">
                                  {tc}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">No test cases</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.compliance.map((standard) => (
                              <Badge key={standard} variant="outline" className="text-xs">
                                {standard}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Coverage Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Coverage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Requirements</span>
                    <span className="font-medium">{traceabilityData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fully Covered</span>
                    <span className="font-medium text-green-600">
                      {traceabilityData.filter(i => i.status === "Covered").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Coverage Gaps</span>
                    <span className="font-medium text-red-600">
                      {traceabilityData.filter(i => i.status === "Not Covered").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">FDA Compliance</span>
                    <Badge variant="default">85%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ISO Standards</span>
                    <Badge variant="outline">70%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">GDPR/HIPAA</span>
                    <Badge variant="default">90%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">High Risk Gaps</span>
                    <Badge variant="destructive">2</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Medium Risk</span>
                    <Badge variant="outline">3</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Low Risk</span>
                    <Badge variant="secondary">1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TraceabilityMatrix;