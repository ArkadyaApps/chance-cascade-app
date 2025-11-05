import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";
import { Trophy, Shield, Users, Sparkles } from "lucide-react";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="About Us" />
      
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 border-none shadow-xl">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Lucksy
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Your premier destination for exciting prize draws and gaming experiences. 
            We're dedicated to bringing you the best in online gaming entertainment.
          </p>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Exciting Prizes</h3>
            <p className="text-sm text-muted-foreground">
              Win amazing prizes every day
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-muted-foreground">
              Safe and protected platform
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-3">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-muted-foreground">
              Join thousands of players
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-3">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Fair Play</h3>
            <p className="text-sm text-muted-foreground">
              Transparent and fair draws
            </p>
          </Card>
        </div>

        {/* Mission */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-3">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            At Lucksy, we believe everyone deserves a chance to win. Our platform 
            combines cutting-edge technology with fair gaming practices to create 
            an exciting and trustworthy experience for all our users.
          </p>
        </Card>

        {/* Contact */}
        <Card className="p-6 bg-gradient-to-br from-secondary/30 to-accent/10">
          <h2 className="text-xl font-bold mb-3">Get in Touch</h2>
          <p className="text-muted-foreground">
            Have questions or feedback? We'd love to hear from you. 
            Visit our Contact page to get in touch with our support team.
          </p>
        </Card>

        {/* Version Info */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          Lucksy v1.0.0 • All rights reserved
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
