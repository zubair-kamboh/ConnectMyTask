// Avatar.js
const Avatar = ({ name, profilePhoto, size = 'md', className = '' }) => {
  const initials = name
    ? name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : '?'

  const showInitials = !profilePhoto || profilePhoto === ''

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-xl',
  }

  const avatarClass = `rounded-full object-cover ${
    sizeClasses[size] || sizeClasses.md
  } ${className}`

  return showInitials ? (
    <div
      className={`${avatarClass} bg-[#E0E0E0] text-[#1A3D8F] font-bold flex items-center justify-center dark:bg-gray-700 dark:text-white`}
    >
      {initials}
    </div>
  ) : (
    <img src={profilePhoto} alt="Profile" className={avatarClass} />
  )
}

export default Avatar
