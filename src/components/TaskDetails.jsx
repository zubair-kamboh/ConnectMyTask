'use client'

import {
  Box,
  Typography,
  Paper,
  Avatar,
  Container,
  Chip,
  Stack,
} from '@mui/material'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Layout from './Layout'

export default function TaskDetailsPage() {
  const { state } = useLocation()
  const task = state?.task

  if (!task) return <div>No task selected</div>

  return (
    <>
      <Layout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Task Info */}
            <Paper elevation={3} sx={{ my: 4, p: 3, borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {task.title}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2, flexWrap: 'wrap' }}
              >
                <Chip label={`Budget: $${task.budget}`} color="primary" />
                <Chip
                  label={`Deadline: ${new Date(
                    task.deadline
                  ).toLocaleDateString()}`}
                  color="secondary"
                />
                <Chip label={`Status: ${task.status}`} variant="outlined" />
                <Chip label={`Category: ${task.category}`} variant="outlined" />
              </Stack>

              <Typography variant="h6" gutterBottom>
                Description:
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {task.description}
              </Typography>

              {/* Location and Posted By */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                <Box>
                  <Typography variant="h6">Location:</Typography>
                  <Typography>
                    {task.location.suburb}, {task.location.city},{' '}
                    {task.location.state}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6">Posted by:</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar>{task.user.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography>{task.user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.user.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {/* Images Carousel */}
            <Carousel
              additionalTransfrom={0}
              arrows
              autoPlaySpeed={3000}
              centerMode={false}
              containerClass="carousel-container"
              dotListClass=""
              draggable
              focusOnSelect={false}
              infinite
              itemClass="carousel-item-padding-40-px"
              keyBoardControl
              minimumTouchDrag={80}
              renderButtonGroupOutside={false}
              renderDotsOutside={false}
              responsive={{
                desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
                tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
                mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
              }}
              showDots
              slidesToSlide={1}
              swipeable
            >
              {task.images.map((img, index) => (
                <Box
                  key={index}
                  sx={{
                    height: { xs: 200, sm: 400 },
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 2,
                  }}
                />
              ))}
            </Carousel>
          </motion.div>
        </Container>
      </Layout>
    </>
  )
}
