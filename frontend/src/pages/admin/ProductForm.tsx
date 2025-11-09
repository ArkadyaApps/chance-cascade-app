import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { usePartners } from "@/hooks/usePartners";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { countries } from "@/lib/countries";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  imageUrl: z.string().url("Must be a valid URL"),
  minTickets: z.number().min(1, "Must be at least 1"),
  ticketsRequired: z.number().min(10, "Must be at least 10"),
  category: z.enum(["electronics", "gaming", "fashion", "home", "sports", "other"]),
  drawDate: z.string().min(1, "Draw date is required"),
  featured: z.boolean(),
  partnerId: z.string().optional(),
  availableCountries: z.array(z.string()).optional(),
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: product, isLoading: productLoading } = useProduct(id || "");
  const { data: partners } = usePartners();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    product?.available_countries || []
  );

  const isEditMode = !!id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      minTickets: parseInt(formData.get("minTickets") as string),
      ticketsRequired: parseInt(formData.get("ticketsRequired") as string),
      category: formData.get("category") as string,
      drawDate: formData.get("drawDate") as string,
      featured: formData.get("featured") === "on",
      partnerId: formData.get("partnerId") as string || undefined,
      availableCountries: selectedCountries,
    };

    try {
      const validated = productSchema.parse(data);

      const productData = {
        name: validated.name,
        description: validated.description,
        images: [validated.imageUrl],
        ticket_price: 1, // Fixed at 1
        tickets_required: validated.ticketsRequired,
        category: validated.category,
        draw_date: new Date(validated.drawDate).toISOString(),
        featured: validated.featured,
        partner_id: validated.partnerId || null,
        available_countries: validated.availableCountries || [],
      };

      if (isEditMode) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Product updated",
          description: "The product has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData);

        if (error) throw error;

        toast({
          title: "Product created",
          description: "The product has been added successfully.",
        });
      }

      navigate("/admin/products");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: isEditMode ? "Update failed" : "Create failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditMode && productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/products")}
              className="text-primary-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-primary-foreground">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="iPhone 15 Pro Max"
                defaultValue={product?.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Latest flagship smartphone with titanium design..."
                rows={4}
                defaultValue={product?.description}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://images.unsplash.com/..."
                defaultValue={product?.images[0]}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minTickets">Minimum Tickets to Participate</Label>
                <Input
                  id="minTickets"
                  name="minTickets"
                  type="number"
                  min="1"
                  placeholder="1"
                  defaultValue={1}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum number of tickets users must purchase
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketsRequired">Total Tickets for Draw</Label>
                <Input
                  id="ticketsRequired"
                  name="ticketsRequired"
                  type="number"
                  min="10"
                  placeholder="200"
                  defaultValue={product?.tickets_required}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Ticket price is fixed at 1 credit
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                defaultValue={product?.category || "electronics"}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="drawDate">Draw Date</Label>
              <Input
                id="drawDate"
                name="drawDate"
                type="datetime-local"
                defaultValue={
                  product?.draw_date
                    ? new Date(product.draw_date).toISOString().slice(0, 16)
                    : defaultDate.toISOString().slice(0, 16)
                }
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                name="featured"
                defaultChecked={product?.featured}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured product
              </Label>
            </div>

            {/* Partner Selection */}
            <div className="space-y-2">
              <Label htmlFor="partnerId">Partner (Optional)</Label>
              <Select name="partnerId" defaultValue={product?.partner_id || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a partner" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="">No Partner</SelectItem>
                  {partners?.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a partner organization for this product
              </p>
            </div>

            {/* Country Selection */}
            <div className="space-y-2">
              <Label htmlFor="countries">Available Countries</Label>
              <Select
                onValueChange={(value) => {
                  if (value && !selectedCountries.includes(value)) {
                    setSelectedCountries([...selectedCountries, value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select countries where product ships" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50 max-h-[300px]">
                  {countries.map((country) => (
                    <SelectItem 
                      key={country.code} 
                      value={country.code}
                      disabled={selectedCountries.includes(country.code)}
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedCountries.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCountries.map((code) => {
                    const country = countries.find((c) => c.code === code);
                    return (
                      <Badge key={code} variant="secondary" className="gap-1">
                        {country?.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCountries(
                              selectedCountries.filter((c) => c !== code)
                            )
                          }
                          className="ml-1 hover:bg-destructive/20 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Leave empty to make available worldwide
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/admin/products")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-accent"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditMode ? "Update Product" : "Create Product"}</>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;
