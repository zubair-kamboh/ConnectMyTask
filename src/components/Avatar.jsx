const Avatar = ({ name, profilePhoto }) => {
  const initials = name
    ? name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : '?'

  const showInitials = !profilePhoto || profilePhoto === ''

  return showInitials ? (
    <div className="w-10 h-10 rounded-full bg-[#E0E0E0] text-[#1A3D8F] font-bold flex items-center justify-center text-sm dark:bg-gray-700 dark:text-white">
      {initials}
    </div>
  ) : (
    <img
      src={profilePhoto}
      alt="Profile"
      className="w-10 h-10 rounded-full object-cover"
    />
  )
}

export default Avatar
