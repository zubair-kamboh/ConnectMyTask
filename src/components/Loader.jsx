import { CircularProgress, Box, useTheme } from '@mui/material'

export default function Loader({ fullScreen = false }) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...(fullScreen
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: isDarkMode
                ? 'rgba(0,0,0,0.7)'
                : 'rgba(255,255,255,0.7)',
              zIndex: 9999,
            }
          : { py: 2 }),
      }}
    >
      <CircularProgress color={isDarkMode ? 'inherit' : 'primary'} />
    </Box>
  )
}
