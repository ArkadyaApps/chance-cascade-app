import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
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

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  imageUrl: z.string().url("Must be a valid URL"),
  ticketPrice: z.number().min(1, "Must be at least 1"),
  ticketsRequired: z.number().min(10, "Must be at least 10"),
  category: z.enum(["electronics", "gaming", "fashion", "home", "sports", "other"]),
  drawDate: z.string().min(1, "Draw date is required"),
  featured: z.boolean(),
  partnerName: z.string().optional(),
  partnerLogoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  partnerWebsite: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  partnerDescription: z.string().max(200, "Description must be less than 200 characters").optional(),
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: product, isLoading: productLoading } = useProduct(id || "");
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      ticketPrice: parseInt(formData.get("ticketPrice") as string),
      ticketsRequired: parseInt(formData.get("ticketsRequired") as string),
      category: formData.get("category") as string,
      drawDate: formData.get("drawDate") as string,
      featured: formData.get("featured") === "on",
      partnerName: formData.get("partnerName") as string,
      partnerLogoUrl: formData.get("partnerLogoUrl") as string,
      partnerWebsite: formData.get("partnerWebsite") as string,
      partnerDescription: formData.get("partnerDescription") as string,
    };

    try {
      const validated = productSchema.parse(data);

      const productData = {
        name: validated.name,
        description: validated.description,
        images: [validated.imageUrl],
        ticket_price: validated.ticketPrice,
        tickets_required: validated.ticketsRequired,
        category: validated.category,
        draw_date: new Date(validated.drawDate).toISOString(),
        featured: validated.featured,
        partner_name: validated.partnerName || null,
        partner_logo_url: validated.partnerLogoUrl || null,
        partner_website: validated.partnerWebsite || null,
        partner_description: validated.partnerDescription || null,
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
                <Label htmlFor="ticketPrice">Ticket Price</Label>
                <Input
                  id="ticketPrice"
                  name="ticketPrice"
                  type="number"
                  min="1"
                  placeholder="1"
                  defaultValue={product?.ticket_price}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketsRequired">Tickets Required</Label>
                <Input
                  id="ticketsRequired"
                  name="ticketsRequired"
                  type="number"
                  min="10"
                  placeholder="200"
                  defaultValue={product?.tickets_required}
                  required
                />
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

            {/* Partner Information Section */}
            <div className="space-y-4 pt-6 border-t">
              <div>
                <h3 className="text-lg font-semibold mb-2">Partner Information</h3>
                <p className="text-sm text-muted-foreground">
                  Optional details about the partner/affiliate offering this product
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerName">Partner Name</Label>
                <Input
                  id="partnerName"
                  name="partnerName"
                  placeholder="e.g., Apple, Nike, Sony"
                  defaultValue={product?.partner_name || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerLogoUrl">Partner Logo URL</Label>
                <Input
                  id="partnerLogoUrl"
                  name="partnerLogoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  defaultValue={product?.partner_logo_url || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerWebsite">Partner Website</Label>
                <Input
                  id="partnerWebsite"
                  name="partnerWebsite"
                  type="url"
                  placeholder="https://partner.com"
                  defaultValue={product?.partner_website || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerDescription">Partner Description</Label>
                <Textarea
                  id="partnerDescription"
                  name="partnerDescription"
                  placeholder="Brief description of the partner brand..."
                  rows={3}
                  maxLength={200}
                  defaultValue={product?.partner_description || ""}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 200 characters
                </p>
              </div>
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
