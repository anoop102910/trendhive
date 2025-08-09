import React, { useState, useEffect } from "react";
import { useTable, CrudFilter } from "@refinedev/core";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
}

export const OrderListPage: React.FC = () => {
  const { tableQueryResult, setFilters, setSorters } = useTable<Order>({
    resource: "orders",
    syncWithLocation: true,
  });

  const [filters, setLocalFilters] = useState({
    id: "",
    status: "",
    dateRange: undefined as DateRange | undefined,
  });

  useEffect(() => {
    const crudFilters: CrudFilter[] = [];
    if (filters.id) {
      crudFilters.push({ field: "id", operator: "contains", value: filters.id });
    }
    if (filters.status) {
      crudFilters.push({ field: "status", operator: "eq", value: filters.status });
    }
    if (filters.dateRange?.from && filters.dateRange?.to) {
      crudFilters.push({
        field: "createdAt",
        operator: "gte",
        value: filters.dateRange.from.toISOString(),
      });
      crudFilters.push({
        field: "createdAt",
        operator: "lte",
        value: filters.dateRange.to.toISOString(),
      });
    }
    setFilters(crudFilters);
  }, [filters, setFilters]);

  const orders = tableQueryResult?.data?.data || [];

  const handleIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({ ...prev, id: e.target.value }));
  };

  const handleStatusFilterChange = (status: string) => {
    setLocalFilters(prev => ({ ...prev, status }));
  };

  const handleDateFilterChange = (dateRange?: DateRange) => {
    setLocalFilters(prev => ({ ...prev, dateRange }));
  };

  const handleSortChange = (field: string, order: "asc" | "desc") => {
    setSorters([{ field, order }]);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <Input
          placeholder="Filter by Order ID"
          onChange={handleIdFilterChange}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter by Status</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(status => (
              <Button
                key={status}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleStatusFilterChange(status)}
              >
                {status}
              </Button>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DatePickerWithRange onChange={handleDateFilterChange} />
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <Button onClick={() => handleSortChange("createdAt", "asc")}>Sort by Date Asc</Button>
        <Button onClick={() => handleSortChange("createdAt", "desc")}>Sort by Date Desc</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Link to={`/orders/${order.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
