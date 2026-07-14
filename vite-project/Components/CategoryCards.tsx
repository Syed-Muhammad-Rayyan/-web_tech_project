import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

type ServiceCardProps = {
  id:number;
  icon: React.ReactNode;
  title: string;
  desc: string;
};
export const CategoryCards: React.FC<ServiceCardProps> = ({
  id,
  icon,
  title,
  desc,
}) => {
  const navigate = useNavigate()
  return (
    <Box sx={{marginTop:7}} >
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          transition: "all .3s ease",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0 20px 40px rgba(0,0,0,.15)",
          },
        }}
      >
        <CardContent className="flex flex-col items-center text-center p-8">
          {/* Badge */}
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
            Popular
          </span>

          {/* Icon */}
          <div className="mt-5 w-20 h-20 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center shadow-md">
            {icon}
          </div>

          {/* Title */}
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
            {title}
          </Typography>

          {/* Description */}
          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
              lineHeight: 1.8,
            }}
          >
            Find trusted {desc.toLowerCase()} professionals available in your
            neighbourhood.
          </Typography>

          {/* Button */}
          <Button
          onClick={() => navigate(`/CategoryDetails/${id}`) }
            variant="contained"
            sx={{
              mt: 4,
              borderRadius: "50px",
              px: 4,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(to right, #4f46e5, #2563eb)",
              "&:hover": {
                background: "linear-gradient(to right, #4338ca, #1d4ed8)",
              },
            }}
          >
            Explore →
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
