import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            py: 10,
            textAlign: 'center',
            color: 'primary.contrastText',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Find Trusted Task Providers Instantly
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Post a task, get bids, and hire the best service providers.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/register"
              sx={{
                mt: 4,
                bgcolor: 'background.paper',
                color: 'primary.main',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
              }}
            >
              Get Started
            </Button>
          </Container>
        </Box>

        {/* Features Section */}
        <Container sx={{ py: 10 }}>
          <Grid container spacing={4} textAlign="center">
            {[
              {
                title: 'Post a Task',
                desc: 'Easily post your task with details, budget, and deadline.',
              },
              {
                title: 'Get Bids',
                desc: 'Service providers bid on your task with competitive offers.',
              },
              {
                title: 'Hire & Pay',
                desc: 'Choose best provider, track the task, and pay securely.',
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Testimonials Section */}
        <Box sx={{ bgcolor: 'grey.100', py: 10, textAlign: 'center' }}>
          <Container maxWidth="sm">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              What Our Users Say
            </Typography>
            <Typography variant="body1" color="text.secondary">
              See how ConnectMyTask has helped thousands of users.
            </Typography>
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  )
}
