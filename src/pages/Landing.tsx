import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Camera, AlertTriangle, BarChart3, Smartphone, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: "Smart Reporting",
      description: "Capture issues with AI-powered analysis for instant repair estimates"
    },
    {
      icon: MapPin,
      title: "GPS Tracking",
      description: "Precise location mapping for efficient municipal response"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Alerts",
      description: "Real-time notifications for severe weather and infrastructure risks"
    },
    {
      icon: BarChart3,
      title: "Data Dashboard",
      description: "Comprehensive analytics for informed urban planning decisions"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized for on-the-go reporting and municipal management"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for municipal data and citizen privacy"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SURRS</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button variant="municipal" onClick={() => navigate("/login")}>
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Smart City Infrastructure" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Smart Urban Rain
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Resilience System
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Empowering citizens and municipalities to collaboratively address urban infrastructure challenges through AI-powered reporting and real-time monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="municipal" onClick={() => navigate("/login")} className="text-lg px-8 py-4">
                Start Reporting Issues
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/admin")} className="text-lg px-8 py-4">
                Municipal Dashboard
              </Button>
            </div>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">AI</div>
                <div className="text-sm text-muted-foreground">Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Real-time</div>
                <div className="text-sm text-muted-foreground">Updates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">GPS</div>
                <div className="text-sm text-muted-foreground">Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Built for Urban Resilience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced technology meets community engagement to create safer, more resilient cities.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Build Resilient Cities?
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join municipalities and citizens already using SURRS to create safer, more responsive urban environments.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
              Get Started Today
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">SURRS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Smart Urban Rain Resilience System. Built for hackathon demo.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;