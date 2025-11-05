import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Globe, Bell, User, Trash2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [fullName, setFullName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.notifications_enabled ?? true);
  const [emailNotifications, setEmailNotifications] = useState(profile?.email_notifications ?? true);
  const [pushNotifications, setPushNotifications] = useState(profile?.push_notifications ?? true);
  const [isSaving, setIsSaving] = useState(false);

  // Update state when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setMiddleName(profile.middle_name || "");
      setCountry(profile.country || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!fullName.trim() || !middleName.trim() || !country.trim() || !address.trim()) {
      toast.error(t("common.error"), {
        description: "All fields are required",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({ 
        full_name: fullName,
        middle_name: middleName,
        country: country,
        address: address
      });
      toast.success(t("settings.settingsSaved"));
    } catch (error) {
      toast.error(t("settings.settingsError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ [field]: value })
        .eq("id", user?.id);

      if (error) throw error;
      
      toast.success(t("settings.settingsSaved"));
    } catch (error) {
      toast.error(t("settings.settingsError"));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              className="text-primary-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">{t("settings.title")}</h1>
              <p className="text-primary-foreground/80 text-sm">{t("settings.subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Language Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-lg font-semibold">{t("settings.language")}</h2>
                <p className="text-sm text-muted-foreground">{t("settings.languageDescription")}</p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-lg font-semibold">{t("settings.notifications")}</h2>
                <p className="text-sm text-muted-foreground">{t("settings.notificationsDescription")}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications-enabled">{t("settings.enableNotifications")}</Label>
                  </div>
                  <Switch
                    id="notifications-enabled"
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => {
                      setNotificationsEnabled(checked);
                      handleNotificationChange("notifications_enabled", checked);
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between opacity-50 pointer-events-none">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">{t("settings.emailNotifications")}</Label>
                    <p className="text-xs text-muted-foreground">{t("settings.emailNotificationsDesc")}</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between opacity-50 pointer-events-none">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">{t("settings.pushNotifications")}</Label>
                    <p className="text-xs text-muted-foreground">{t("settings.pushNotificationsDesc")}</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Information */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-lg font-semibold">{t("settings.account")}</h2>
                <p className="text-sm text-muted-foreground">{t("settings.accountDescription")}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">
                    {t("settings.fullName")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middle-name">
                    Middle Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="middle-name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Michael"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.email")}</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <Button
                  onClick={handleUpdateProfile}
                  disabled={isSaving || !fullName.trim() || !middleName.trim() || !country.trim() || !address.trim()}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("settings.updating")}
                    </>
                  ) : (
                    t("settings.updateProfile")
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive/50">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-destructive">{t("settings.danger")}</h2>
                <p className="text-sm text-muted-foreground">{t("settings.dangerDescription")}</p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("settings.deleteAccount")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        toast.error("Account deletion is not yet implemented");
                      }}
                    >
                      {t("common.delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
