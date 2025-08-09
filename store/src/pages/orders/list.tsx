import React, { useState, useEffect } from "react";
import { useTable, CrudFilter } from "@refinedev/core";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Package, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { ErrorComponent } from "@/components/Error";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
}

export const OrderListPage: React.FC = () => {
  const {
    tableQueryResult,
    setFilters,
    setSorters,
    current,
    setCurrent,
    pageCount,
  } = useTable<Order>({
    resource: "orders",
    syncWithLocation: true,
  });

  const { isLoading, isError, refetch } = tableQueryResult;

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

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-green-500";
      case "DELIVERED":
        return "bg-green-700";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const OrderCardSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-1/3" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isError) {
    return <ErrorComponent refetch={refetch} />;
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <OrderCardSkeleton key={i} />)
          : orders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="truncate">Order #{order.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrent(current - 1)}
              aria-disabled={current === 1}
            />
          </PaginationItem>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrent(page)}
                isActive={current === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrent(current + 1)}
              aria-disabled={current === pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
