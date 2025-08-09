import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  message?: string;
  refetch?: () => void;
}

export const ErrorComponent: React.FC<ErrorProps> = ({
  message = "An unexpected error occurred.",
  refetch,
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center space-x-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{message}</p>
          {refetch && (
            <Button onClick={refetch}>
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
