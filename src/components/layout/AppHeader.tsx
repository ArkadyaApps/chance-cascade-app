import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const AppHeader = ({ title, subtitle, showLogo = true }: AppHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="p-4" style={{ backgroundColor: '#F5F5DC' }}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2">
          {showLogo && (
            <img 
              src={logo} 
              alt="Lucksy" 
              className="h-8 cursor-pointer" 
              onClick={() => navigate("/")}
            />
          )}
          {!showLogo && title && (
            <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>{title}</h1>
          )}
          <LanguageSwitcher />
        </div>
        {subtitle && (
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
