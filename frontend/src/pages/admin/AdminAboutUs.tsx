import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAboutUsContent, useUpdateAboutUs } from "@/hooks/useAboutUs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const AdminAboutUs = () => {
  const { toast } = useToast();
  const { data: content, isLoading } = useAboutUsContent();
  const updateAboutUs = useUpdateAboutUs();

  const [formData, setFormData] = useState({
    hero_title: "",
    hero_description: "",
    mission_title: "",
    mission_description: "",
    feature_1_title: "",
    feature_1_description: "",
    feature_2_title: "",
    feature_2_description: "",
    feature_3_title: "",
    feature_3_description: "",
    feature_4_title: "",
    feature_4_description: "",
    contact_title: "",
    contact_description: "",
  });

  // Initialize form data when content loads
  useState(() => {
    if (content) {
      setFormData({
        hero_title: content.hero_title,
        hero_description: content.hero_description,
        mission_title: content.mission_title,
        mission_description: content.mission_description,
        feature_1_title: content.feature_1_title,
        feature_1_description: content.feature_1_description,
        feature_2_title: content.feature_2_title,
        feature_2_description: content.feature_2_description,
        feature_3_title: content.feature_3_title,
        feature_3_description: content.feature_3_description,
        feature_4_title: content.feature_4_title,
        feature_4_description: content.feature_4_description,
        contact_title: content.contact_title,
        contact_description: content.contact_description,
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAboutUs.mutateAsync(formData);
      toast({
        title: "Success",
        description: "About Us content updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-96 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  // Update form data when content loads
  if (content && formData.hero_title === "") {
    setFormData({
      hero_title: content.hero_title,
      hero_description: content.hero_description,
      mission_title: content.mission_title,
      mission_description: content.mission_description,
      feature_1_title: content.feature_1_title,
      feature_1_description: content.feature_1_description,
      feature_2_title: content.feature_2_title,
      feature_2_description: content.feature_2_description,
      feature_3_title: content.feature_3_title,
      feature_3_description: content.feature_3_description,
      feature_4_title: content.feature_4_title,
      feature_4_description: content.feature_4_description,
      contact_title: content.contact_title,
      contact_description: content.contact_description,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit About Us Page</h1>
        <p className="text-muted-foreground">
          Update the content displayed on the About Us page
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) =>
                  setFormData({ ...formData, hero_title: e.target.value })
                }
                placeholder="Welcome to Lucksy"
              />
            </div>
            <div>
              <Label htmlFor="hero_description">Hero Description</Label>
              <Textarea
                id="hero_description"
                value={formData.hero_description}
                onChange={(e) =>
                  setFormData({ ...formData, hero_description: e.target.value })
                }
                placeholder="Your premier destination..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Feature {num}</h3>
                <div>
                  <Label htmlFor={`feature_${num}_title`}>Title</Label>
                  <Input
                    id={`feature_${num}_title`}
                    value={formData[`feature_${num}_title` as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`feature_${num}_title`]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`feature_${num}_description`}>Description</Label>
                  <Textarea
                    id={`feature_${num}_description`}
                    value={formData[`feature_${num}_description` as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`feature_${num}_description`]: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Mission */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Mission Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mission_title">Mission Title</Label>
              <Input
                id="mission_title"
                value={formData.mission_title}
                onChange={(e) =>
                  setFormData({ ...formData, mission_title: e.target.value })
                }
                placeholder="Our Mission"
              />
            </div>
            <div>
              <Label htmlFor="mission_description">Mission Description</Label>
              <Textarea
                id="mission_description"
                value={formData.mission_description}
                onChange={(e) =>
                  setFormData({ ...formData, mission_description: e.target.value })
                }
                placeholder="At Lucksy, we believe..."
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Contact Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact_title">Contact Title</Label>
              <Input
                id="contact_title"
                value={formData.contact_title}
                onChange={(e) =>
                  setFormData({ ...formData, contact_title: e.target.value })
                }
                placeholder="Get in Touch"
              />
            </div>
            <div>
              <Label htmlFor="contact_description">Contact Description</Label>
              <Textarea
                id="contact_description"
                value={formData.contact_description}
                onChange={(e) =>
                  setFormData({ ...formData, contact_description: e.target.value })
                }
                placeholder="Have questions or feedback..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={updateAboutUs.isPending}
            className="min-w-32"
          >
            {updateAboutUs.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAboutUs;
