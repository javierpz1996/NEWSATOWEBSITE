type HomeIntroLoadingPawIconProps = {
  className?: string;
};

export function HomeIntroLoadingPawIcon({ className }: HomeIntroLoadingPawIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={22}
      height={22}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse fill="currentColor" cx="12" cy="16.75" rx="5.75" ry="5" />
      <ellipse fill="currentColor" cx="5.25" cy="10.75" rx="2.5" ry="3.15" />
      <ellipse fill="currentColor" cx="9.75" cy="7.85" rx="2.25" ry="2.95" />
      <ellipse fill="currentColor" cx="14.25" cy="7.85" rx="2.25" ry="2.95" />
      <ellipse fill="currentColor" cx="18.75" cy="10.75" rx="2.5" ry="3.15" />
    </svg>
  );
}
