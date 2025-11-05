import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAllEntries } from "@/hooks/useAllEntries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Search, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminEntries = () => {
  const navigate = useNavigate();
  const { data: entries, isLoading } = useAllEntries();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filter entries
  const filteredEntries = useMemo(() => {
    if (!entries) return [];

    return entries.filter((entry) => {
      const product = entry.products;
      const profile = entry.profiles;
      
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        product?.name.toLowerCase().includes(searchLower) ||
        profile?.email.toLowerCase().includes(searchLower) ||
        profile?.full_name?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = 
        statusFilter === "all" || entry.status === statusFilter;

      // Category filter
      const matchesCategory = 
        categoryFilter === "all" || product?.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [entries, searchQuery, statusFilter, categoryFilter]);

  // Export to CSV
  const handleExport = () => {
    if (!filteredEntries || filteredEntries.length === 0) return;

    const headers = [
      "Entry ID",
      "User Email",
      "User Name",
      "Product Name",
      "Category",
      "Tickets Spent",
      "Status",
      "Entry Date",
      "Draw Date",
    ];

    const rows = filteredEntries.map((entry) => {
      const product = entry.products;
      const profile = entry.profiles;
      
      return [
        entry.id,
        profile?.email || "N/A",
        profile?.full_name || "N/A",
        product?.name || "N/A",
        product?.category || "N/A",
        entry.tickets_spent,
        entry.status,
        new Date(entry.created_at).toLocaleDateString(),
        product?.draw_date ? new Date(product.draw_date).toLocaleDateString() : "N/A",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => 
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `lucksy-entries-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = useMemo(() => {
    if (!entries) return [];
    const cats = new Set(entries.map(e => e.products?.category).filter(Boolean));
    return Array.from(cats);
  }, [entries]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin")}
              className="text-primary-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary-foreground">All Entries</h1>
              <p className="text-primary-foreground/80">
                {filteredEntries?.length || 0} entries {searchQuery || statusFilter !== "all" || categoryFilter !== "all" ? "(filtered)" : ""}
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={!filteredEntries || filteredEntries.length === 0}
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by user or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/95"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background/95">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-background/95">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat || ""}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <Card className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </Card>
        ) : filteredEntries.length === 0 ? (
          <Card className="p-12 text-center">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No entries found</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filters"
                : "No users have entered any draws yet"}
            </p>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Tickets</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Entry Date</TableHead>
                    <TableHead>Draw Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => {
                    const product = entry.products;
                    const profile = entry.profiles;
                    
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {profile?.full_name || "Unknown User"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {profile?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product?.images[0]}
                              alt={product?.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <span className="font-medium">{product?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product?.category}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {entry.tickets_spent}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              entry.status === "won"
                                ? "default"
                                : entry.status === "lost"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.created_at), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product?.draw_date
                            ? formatDistanceToNow(new Date(product.draw_date), {
                                addSuffix: true,
                              })
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminEntries;
