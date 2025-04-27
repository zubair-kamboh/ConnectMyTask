import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Avatar,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Lottie from 'lottie-react'
import emptyAnimation from '../assets/empty-state.json' // <-- Put your Lottie JSON here

export default function TaskOffersPage() {
  const theme = useTheme()
  const [tabValue, setTabValue] = useState(0)
  const [loadingOffers, setLoadingOffers] = useState(true)
  const [offers, setOffers] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setOffers([
        {
          id: 1,
          name: 'John Doe',
          price: 120,
          message: 'Can complete this today!',
        },
        {
          id: 2,
          name: 'Jane Smith',
          price: 130,
          message: 'Available tomorrow morning.',
        },
      ])
      setLoadingOffers(false)
    }, 2000)
  }, [])

  return (
    <Box minHeight="100vh" bgcolor={theme.palette.background.default} p={3}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Task: Help move my sofa
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(e, val) => setTabValue(val)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Offers" />
        <Tab label="Questions" />
        <Tab label="Details" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          {loadingOffers ? (
            <>
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ borderRadius: 2, mb: 2 }}
              />
            </>
          ) : offers.length === 0 ? (
            <Box textAlign="center" mt={5}>
              <Box maxWidth={300} mx="auto">
                <Lottie animationData={emptyAnimation} loop />
              </Box>
              <Typography variant="h6" mt={2}>
                No offers yet
              </Typography>
              <Button variant="contained" sx={{ mt: 2, borderRadius: 10 }}>
                Post Another Task
              </Button>
            </Box>
          ) : (
            offers.map((offer) => (
              <Card
                key={offer.id}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: '0.3s',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                    <Box flexGrow={1}>
                      <Typography fontWeight={600}>{offer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {offer.message}
                      </Typography>
                    </Box>
                    <Typography
                      fontWeight={700}
                      color="primary"
                      fontSize="1.2rem"
                    >
                      ${offer.price}
                    </Typography>
                  </Box>
                  <Box mt={2} display="flex" gap={2}>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ flex: 1 }}
                    >
                      Accept Offer
                    </Button>
                    <Button variant="outlined" sx={{ flex: 1 }}>
                      Chat
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Accordion sx={{ borderRadius: 2, boxShadow: 3, mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>
                What time do you need it moved?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Anytime after 5PM is fine!</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ borderRadius: 2, boxShadow: 3, mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>
                Is there a lift available?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Yes, there is a lift in the building.</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" mb={2}>
            Task Details
          </Typography>
          <Typography>
            I need help moving my sofa from my apartment to a nearby storage
            unit. Ideally this weekend. Will require a small van or ute.
          </Typography>
          <Box mt={3}>
            <Typography variant="subtitle2">Location:</Typography>
            <Typography>Hadfield, Melbourne VIC</Typography>
            <Typography variant="subtitle2" mt={2}>
              Budget:
            </Typography>
            <Typography>$150</Typography>
            <Typography variant="subtitle2" mt={2}>
              Deadline:
            </Typography>
            <Typography>31st Dec 2025</Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
