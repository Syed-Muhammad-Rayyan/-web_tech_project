import { Button, Card, CardContent, Typography } from "@mui/material";

type CategoryServicesCard = {
  title: string;
};

export const CategoryServicesCard: React.FC<CategoryServicesCard> = ({ title }) => {
  return (
    <div>
      <Card
        sx={{
          borderRadius: 4,
          transition: ".3s",
          "&:hover": {
            transform: "translateY(-5px)",
          },
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Trusted local professionals available.
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: 10,
              textTransform: "none",
            }}
          >
            Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

