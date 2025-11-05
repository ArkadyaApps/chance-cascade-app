import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Building2,
  Handshake,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const partnerFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  productCategory: z.string().min(2, "Please specify product category"),
  message: z.string().min(20, "Message must be at least 20 characters").max(1000, "Message is too long"),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<PartnerFormData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    productCategory: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PartnerFormData, string>>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof PartnerFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    try {
      partnerFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof PartnerFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof PartnerFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Submit to edge function
      const { data, error } = await supabase.functions.invoke("submit-partner-inquiry", {
        body: formData,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: t("contact.success"),
        description: t("contact.successMessage"),
      });

      // Reset form
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        website: "",
        productCategory: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("contact.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="bg-gradient-to-r from-primary to-accent p-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 text-primary-foreground hover:text-primary-foreground/80"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.back")}
            </Button>
            <h1 className="text-2xl font-bold text-primary-foreground">
              {t("contact.title")}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 -mt-4">
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3">{t("contact.thankYou")}</h2>
            <p className="text-muted-foreground mb-6">
              {t("contact.thankYouMessage")}
            </p>
            <Button onClick={() => setIsSuccess(false)}>
              {t("contact.sendAnother")}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-primary-foreground hover:text-primary-foreground/80"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-primary-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">
                {t("contact.title")}
              </h1>
              <p className="text-sm text-primary-foreground/80">
                {t("contact.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 -mt-4 space-y-6">
        {/* Contact Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {t("contact.getInTouch")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("contact.email")}</h3>
                <a
                  href="mailto:support@lucksy.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  support@lucksy.com
                </a>
                <br />
                <a
                  href="mailto:partners@lucksy.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  partners@lucksy.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("contact.phone")}</h3>
                <a
                  href="tel:+1-555-LUCKSY-1"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (555) LUCKSY-1
                </a>
                <br />
                <span className="text-xs text-muted-foreground">
                  {t("contact.businessHours")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("contact.address")}</h3>
                <address className="text-sm text-muted-foreground not-italic">
                  123 Lucky Street
                  <br />
                  Prize City, PC 12345
                  <br />
                  United States
                </address>
              </div>
            </div>
          </div>
        </Card>

        {/* Partner Inquiry Form */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10">
              <Handshake className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t("contact.partnerInquiry")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("contact.partnerDescription")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  {t("contact.companyName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder={t("contact.companyNamePlaceholder")}
                  className={errors.companyName ? "border-destructive" : ""}
                />
                {errors.companyName && (
                  <p className="text-xs text-destructive">{errors.companyName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">
                  {t("contact.contactName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder={t("contact.contactNamePlaceholder")}
                  className={errors.contactName ? "border-destructive" : ""}
                />
                {errors.contactName && (
                  <p className="text-xs text-destructive">{errors.contactName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {t("contact.email")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("contact.emailPlaceholder")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  {t("contact.phone")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t("contact.phonePlaceholder")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">{t("contact.website")}</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder={t("contact.websitePlaceholder")}
                  className={errors.website ? "border-destructive" : ""}
                />
                {errors.website && (
                  <p className="text-xs text-destructive">{errors.website}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productCategory">
                  {t("contact.productCategory")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="productCategory"
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  placeholder={t("contact.productCategoryPlaceholder")}
                  className={errors.productCategory ? "border-destructive" : ""}
                />
                {errors.productCategory && (
                  <p className="text-xs text-destructive">{errors.productCategory}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                {t("contact.message")} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t("contact.messagePlaceholder")}
                rows={6}
                className={errors.message ? "border-destructive" : ""}
              />
              <div className="flex justify-between items-center">
                {errors.message ? (
                  <p className="text-xs text-destructive">{errors.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {formData.message.length}/1000 {t("contact.characters")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t("contact.sendInquiry")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Additional Information */}
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-3">{t("contact.whyPartner")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("contact.benefit1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("contact.benefit2")}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("contact.benefit3")}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{t("contact.benefit4")}</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
