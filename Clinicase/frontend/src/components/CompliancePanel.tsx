import { Shield, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const CompliancePanel = () => {
  const complianceStandards = [
    {
      name: "FDA 21 CFR Part 820",
      status: "compliant",
      score: 98,
      description: "Medical device quality system regulation",
      lastAudit: "2024-01-15",
    },
    {
      name: "IEC 62304",
      status: "compliant",
      score: 95,
      description: "Medical device software lifecycle processes",
      lastAudit: "2024-01-10",
    },
    {
      name: "ISO 13485",
      status: "warning",
      score: 87,
      description: "Medical devices quality management systems",
      lastAudit: "2024-01-08",
    },
    {
      name: "ISO 27001",
      status: "compliant",
      score: 92,
      description: "Information security management",
      lastAudit: "2024-01-12",
    },
    {
      name: "GDPR",
      status: "compliant",
      score: 100,
      description: "General Data Protection Regulation",
      lastAudit: "2024-01-14",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "non-compliant":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "default";
      case "warning":
        return "secondary";
      case "non-compliant":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-success";
    if (score >= 85) return "text-warning";
    return "text-destructive";
  };

  const overallScore = Math.round(
    complianceStandards.reduce((acc, std) => acc + std.score, 0) / complianceStandards.length
  );

  return (
    <div className="space-y-6">
      {/* Overall Compliance Score */}
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle>Overall Compliance Score</CardTitle>
          <CardDescription>Real-time compliance monitoring</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
            {overallScore}%
          </div>
          <Progress value={overallScore} className="w-full mb-4" />
          <Badge variant="default" className="bg-success/10 text-success border-success/20">
            Compliant
          </Badge>
        </CardContent>
      </Card>

      {/* Standards Breakdown */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Compliance Standards</CardTitle>
          <CardDescription>Individual standard compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceStandards.map((standard, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  {getStatusIcon(standard.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{standard.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {standard.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last audit: {standard.lastAudit}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getScoreColor(standard.score)}`}>
                    {standard.score}%
                  </div>
                  <Badge variant={getStatusColor(standard.status)} className="text-xs">
                    {standard.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Compliance Alerts</CardTitle>
          <CardDescription>Recent compliance notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">ISO 13485 Score Decrease</p>
                <p className="text-xs text-muted-foreground">
                  Score dropped to 87%. Review quality management processes.
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-success/5 border border-success/20 rounded-lg">
              <CheckCircle className="h-4 w-4 text-success mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">GDPR Audit Completed</p>
                <p className="text-xs text-muted-foreground">
                  Perfect compliance score achieved. All requirements met.
                </p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-info/5 border border-info/20 rounded-lg">
              <Info className="h-4 w-4 text-info mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">FDA Guidance Update</p>
                <p className="text-xs text-muted-foreground">
                  New guidance document available for review and implementation.
                </p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traceability Matrix */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Requirement Traceability</CardTitle>
          <CardDescription>End-to-end requirement coverage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Requirements Coverage</span>
              <span className="text-sm font-medium">94%</span>
            </div>
            <Progress value={94} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Test Case Mapping</span>
              <span className="text-sm font-medium">89%</span>
            </div>
            <Progress value={89} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Risk Assessment</span>
              <span className="text-sm font-medium">96%</span>
            </div>
            <Progress value={96} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};