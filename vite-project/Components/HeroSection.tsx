import { WavingHandOutlined } from "@mui/icons-material";
import { Box, Container, Typography } from "@mui/material";


export const HeroSection = () => {
  return (
     <Box className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20">
        <Container maxWidth="lg">
          <div className="text-center">
            <Typography variant="h3" fontWeight="bold">
              Welcome to Neighbour Hub <WavingHandOutlined/>
            </Typography>

            <Typography className="mt-4 text-gray-200">
              Discover trusted local services, connect with your neighbours, and
              make your community stronger.
            </Typography>
          </div>
        </Container>
      </Box>
  );
};