import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText, Settings, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ExportableItem {
  id: string;
  type: "test-case" | "faq" | "requirement";
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  selected: boolean;
}

const Export = () => {
  const [exportItems, setExportItems] = useState<ExportableItem[]>([
    { id: "TC001", type: "test-case", title: "User Authentication Test", category: "Security", priority: "High", selected: true },
    { id: "TC002", type: "test-case", title: "Data Encryption Validation", category: "Security", priority: "High", selected: true },
    { id: "FAQ001", type: "faq", title: "How to handle patient data?", category: "Compliance", priority: "Medium", selected: false },
    { id: "REQ001", type: "requirement", title: "FDA 21 CFR Part 820 compliance", category: "Regulatory", priority: "High", selected: true },
  ]);
  
  const [exportFormat, setExportFormat] = useState("json");
  const [selectedIntegration, setSelectedIntegration] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSelectAll = (checked: boolean) => {
    setExportItems(items => items.map(item => ({ ...item, selected: checked })));
  };

  const handleItemSelect = (id: string, checked: boolean) => {
    setExportItems(items => items.map(item => 
      item.id === id ? { ...item, selected: checked } : item
    ));
  };

  const handleExport = () => {
    const selectedItems = exportItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to export",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Export initiated",
      description: `Exporting ${selectedItems.length} items in ${exportFormat.toUpperCase()} format`,
    });
  };

  const handleIntegrationExport = (integration: string) => {
    const selectedItems = exportItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to export",
        variant: "destructive"
      });
      return;
    }

    navigate(`/integrations/${integration}`);
  };

  const selectedCount = exportItems.filter(item => item.selected).length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation variant="dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Export & Integration</h1>
              <p className="text-muted-foreground">
                Export test cases, FAQs, and requirements to various formats or integrate with external tools
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Selected ({selectedCount})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Export Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Export Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Settings</CardTitle>
                  <CardDescription>Configure your export preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="format">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Items to Export */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Items to Export</CardTitle>
                      <CardDescription>Select items to include in your export</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="select-all"
                        checked={selectedCount === exportItems.length}
                        onCheckedChange={handleSelectAll}
                      />
                      <Label htmlFor="select-all">Select All</Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exportItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Checkbox
                                checked={item.selected}
                                onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {item.type === "test-case" ? "Test Case" : 
                                 item.type === "faq" ? "FAQ" : "Requirement"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>
                              <Badge variant={
                                item.priority === "High" ? "destructive" :
                                item.priority === "Medium" ? "default" : "secondary"
                              }>
                                {item.priority}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Integration Options */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Options</CardTitle>
                  <CardDescription>Connect with external tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => handleIntegrationExport("jira")}
                  >
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Export to Jira
                    </div>
                    <Settings className="h-4 w-4" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => handleIntegrationExport("polarion")}
                  >
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Export to Polarion
                    </div>
                    <Settings className="h-4 w-4" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => handleIntegrationExport("azure-devops")}
                  >
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Export to Azure DevOps
                    </div>
                    <Settings className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Export Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Selected Items</span>
                      <span className="font-medium">{selectedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Test Cases</span>
                      <span className="font-medium">
                        {exportItems.filter(i => i.selected && i.type === "test-case").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">FAQs</span>
                      <span className="font-medium">
                        {exportItems.filter(i => i.selected && i.type === "faq").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Requirements</span>
                      <span className="font-medium">
                        {exportItems.filter(i => i.selected && i.type === "requirement").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Export;