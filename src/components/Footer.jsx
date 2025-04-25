import { Box, Container, Typography, Link as MuiLink } from '@mui/material'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ConnectMyTask
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          <MuiLink href="/about" color="inherit" underline="hover">
            About
          </MuiLink>
          <MuiLink href="/privacy" color="inherit" underline="hover">
            Privacy Policy
          </MuiLink>
          <MuiLink href="/terms" color="inherit" underline="hover">
            Terms & Conditions
          </MuiLink>
          <MuiLink href="/contact" color="inherit" underline="hover">
            Contact
          </MuiLink>
        </Box>

        <Typography variant="body2" sx={{ mt: 3 }}>
          © {new Date().getFullYear()} ConnectMyTask. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}
