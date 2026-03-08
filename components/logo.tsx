export default function Logo() {
  return (
    <svg width="128" height="70" viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg">
      <text
        fontFamily="'Nunito', system-ui, sans-serif"
        fontWeight="600"
        fontSize="60"
        letterSpacing="-1"
        fill="#4A4A4A"
        x="1"
        y="81"
      >
        TOD
      </text>
      <circle cx="150" cy="60" r="19" stroke="#40E0D0" strokeWidth="6" fill="none" />
      <path
        d="M138 59 L148 70 L164 39"
        stroke="#FF6F61"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
