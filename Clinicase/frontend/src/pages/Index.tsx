import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Target, FileText, CheckCircle, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Generation",
      description: "Convert requirements into compliant test cases automatically using advanced AI",
    },
    {
      icon: Shield,
      title: "Healthcare Compliance",
      description: "Built-in support for FDA, IEC 62304, ISO 13485, and other medical standards",
    },
    {
      icon: Target,
      title: "Enterprise Integration",
      description: "Seamlessly integrate with Jira, Polarion, Azure DevOps, and other ALM tools",
    },
    {
      icon: FileText,
      title: "Multi-Format Support",
      description: "Process PDF, Word, XML, and Markdown documents with intelligent parsing",
    },
    {
      icon: CheckCircle,
      title: "Full Traceability",
      description: "Maintain complete requirement-to-test traceability for audit compliance",
    },
    {
      icon: Users,
      title: "GDPR Ready",
      description: "Privacy-compliant processing with enterprise-grade security",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Test Cases Generated" },
    { value: "98.5%", label: "Compliance Rate" },
    { value: "75%", label: "Time Saved" },
    { value: "50+", label: "Healthcare Clients" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <Navigation variant="landing" />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            AI-Powered Healthcare Testing
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Automate Test Case
            <br />
            <span className="text-white/90">Generation with AI</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Transform healthcare software requirements into compliant, traceable test cases 
            automatically. Reduce manual testing effort by 75% while ensuring regulatory compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="cta">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="hero">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Healthcare Excellence</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to generate compliant test cases for healthcare software development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="bg-gradient-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Regulatory Compliance Built-In</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Our AI understands healthcare regulations and automatically ensures your test cases 
            meet industry standards and compliance requirements.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "FDA 21 CFR Part 820",
              "IEC 62304",
              "ISO 9001",
              "ISO 13485",
              "ISO 27001",
              "GDPR Compliant",
            ].map((standard) => (
              <Badge
                key={standard}
                variant="outline"
                className="justify-center py-3 px-4 text-sm font-medium"
              >
                {standard}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Testing Process?</h2>
          <p className="text-xl text-white/80 mb-8">
            Join healthcare organizations already using AI to streamline their testing workflows
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="cta">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="hero">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-lg font-bold">Healthcare AI Test</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Healthcare AI Test. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
