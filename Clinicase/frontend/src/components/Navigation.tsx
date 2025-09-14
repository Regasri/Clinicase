import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Home, LayoutDashboard, LogIn, UserPlus, Settings, Download } from "lucide-react";
import clincaseLogo from "@/assets/clincase-logo.png";

interface NavigationProps {
  variant?: "landing" | "dashboard";
}

export const Navigation = ({ variant = "landing" }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isLanding = variant === "landing";
  const isDashboard = variant === "dashboard";

  const navigationItems = [
    { name: "Home", href: "/", icon: Home, show: !isDashboard },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, show: true },
    { name: "Traceability", href: "/traceability", icon: LayoutDashboard, show: isDashboard },
    { name: "Export", href: "/export", icon: Download, show: isDashboard },
    { name: "Settings", href: "/settings", icon: Settings, show: isDashboard },
  ];

  const authItems = [
    { name: "Sign In", href: "/login", icon: LogIn, variant: "ghost" as const },
    { name: "Get Started", href: "/signup", icon: UserPlus, variant: "default" as const },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = ({ mobile = false }) => (
    <>
      {navigationItems
        .filter(item => item.show)
        .map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={`${
              mobile 
                ? "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium"
                : "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium"
            } transition-colors ${
              isActive(item.href)
                ? isLanding
                  ? "bg-white/20 text-white"
                  : "bg-primary/10 text-primary"
                : isLanding
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <item.icon className={mobile ? "h-5 w-5" : "h-4 w-4"} />
            <span>{item.name}</span>
          </Link>
        ))}
    </>
  );

  const AuthButtons = ({ mobile = false }) => (
    <div className={`flex ${mobile ? "flex-col space-y-3" : "items-center space-x-4"}`}>
      {authItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => mobile && setIsMobileMenuOpen(false)}
        >
          <Button
            variant={isLanding ? (item.variant === "default" ? "default" : "ghost") : item.variant}
            size={mobile ? "default" : "sm"}
            className={`${mobile ? "w-full justify-start" : ""} ${
              isLanding && item.variant === "ghost"
                ? "text-white hover:bg-white/10"
                : isLanding && item.variant === "default"
                ? "bg-white text-primary hover:bg-white/90"
                : ""
            }`}
          >
            {mobile && <item.icon className="h-4 w-4 mr-2" />}
            {item.name}
          </Button>
        </Link>
      ))}
    </div>
  );

  return (
    <header
      className={`relative z-10 ${
        isLanding
          ? "bg-white/10 backdrop-blur-sm border-b border-white/20"
          : "bg-background border-b border-border shadow-card"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={clincaseLogo} 
              alt="Clincase Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <h1 className={`text-xl font-bold ${
              isLanding ? "text-white" : "text-foreground"
            }`}>
              Clincase
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-2">
              <NavLinks />
            </nav>
            <div className="flex items-center space-x-4">
              {isDashboard && (
                <Badge variant="secondary" className="bg-healthcare-secondary text-healthcare-primary">
                  GDPR Compliant
                </Badge>
              )}
              {isDashboard ? (
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              ) : (
                <AuthButtons />
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={isLanding ? "text-white hover:bg-white/10" : ""}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={clincaseLogo} 
                      alt="Clincase Logo" 
                      className="w-8 h-8 rounded-lg"
                    />
                    <span className="text-lg font-bold">Clincase</span>
                  </div>
                </div>

                <nav className="space-y-2 mb-8">
                  <NavLinks mobile />
                </nav>

                {isDashboard ? (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-healthcare-secondary text-healthcare-primary">
                      GDPR Compliant
                    </Badge>
                    <Button variant="outline" className="w-full justify-start">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </div>
                ) : (
                  <AuthButtons mobile />
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};