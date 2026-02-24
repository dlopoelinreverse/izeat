export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30 flex justify-center">
      <div className="w-full max-w-sm bg-background min-h-screen shadow-xl">
        {children}
      </div>
    </div>
  );
}
