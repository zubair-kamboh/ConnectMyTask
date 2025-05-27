import { useTranslation } from 'react-i18next'
import { MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material'
import { useDarkMode } from '../context/ThemeContext' // Adjust this import path as needed

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const { darkMode } = useDarkMode()

  const handleChange = (event) => {
    const newLang = event.target.value
    i18n.changeLanguage(newLang)
    localStorage.setItem('lang', newLang)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: darkMode ? 'background.paper' : '#f0f0f0',
        p: 1,
        borderRadius: 2,
        boxShadow: 3,
        width: 'fit-content',
        backgroundColor: darkMode
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)',
      }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          labelId="language-switcher-label"
          value={i18n.language}
          label="Language"
          onChange={handleChange}
          sx={{
            color: darkMode ? '#fff' : '#000',
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : '#fff',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(0,0,0,0.2)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#90caf9' : '#1976d2',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: darkMode ? '#90caf9' : '#1976d2',
            },
          }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ur">اردو</MenuItem>
          <MenuItem value="hi">हिन्दी</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default LanguageSwitcher
