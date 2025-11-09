import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";
import { Trophy, Shield, Users, Sparkles } from "lucide-react";
import { useAboutUsContent } from "@/hooks/useAboutUs";
import { Skeleton } from "@/components/ui/skeleton";

const AboutUs = () => {
  const { t } = useTranslation();
  const { data: content, isLoading } = useAboutUsContent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader subtitle="About Us" />
        <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader subtitle="About Us" />
        <div className="max-w-lg mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Content not available</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="About Us" />
      
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 border-none shadow-xl">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {content.hero_title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {content.hero_description}
          </p>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{content.feature_1_title}</h3>
            <p className="text-sm text-muted-foreground">
              {content.feature_1_description}
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{content.feature_2_title}</h3>
            <p className="text-sm text-muted-foreground">
              {content.feature_2_description}
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-3">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">{content.feature_3_title}</h3>
            <p className="text-sm text-muted-foreground">
              {content.feature_3_description}
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-3">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">{content.feature_4_title}</h3>
            <p className="text-sm text-muted-foreground">
              {content.feature_4_description}
            </p>
          </Card>
        </div>

        {/* Mission */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-3">{content.mission_title}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.mission_description}
          </p>
        </Card>

        {/* Contact */}
        <Card className="p-6 bg-gradient-to-br from-secondary/30 to-accent/10">
          <h2 className="text-xl font-bold mb-3">{content.contact_title}</h2>
          <p className="text-muted-foreground">
            {content.contact_description}
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
