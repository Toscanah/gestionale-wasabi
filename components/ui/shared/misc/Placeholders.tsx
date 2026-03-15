function PlaceholderWrapper({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

export function NA() {
  return <PlaceholderWrapper>N/A</PlaceholderWrapper>;
}

export function EnDash() {
  return <PlaceholderWrapper>–</PlaceholderWrapper>;
}

export function EmDash() {
  return <PlaceholderWrapper>—</PlaceholderWrapper>;
}
