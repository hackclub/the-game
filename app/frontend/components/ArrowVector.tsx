export default function ArrowVector({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      preserveAspectRatio="none" 
      width="100%" 
      height="100%" 
      overflow="visible" 
      style={{ display: 'block' }} 
      viewBox="0 0 28 28" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        id="Arrow Vector" 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M0.233334 21.0198L0 0.3966L19.7556 0L27.4556 7.53541L13.7667 7.77337L28 21.813L22.2444 27.9207L7.93333 13.881V28L0.233334 21.0198Z" 
        fill="currentColor"
      />
    </svg>
  );
}
