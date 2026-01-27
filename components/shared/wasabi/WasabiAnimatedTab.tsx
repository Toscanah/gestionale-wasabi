import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface WasabiAnimatedTabProps {
  value: string;
  currentValue: string;
  children: React.ReactNode;
  className?: string;
}

export default function WasabiAnimatedTab({
  value,
  currentValue,
  children,
  className,
}: WasabiAnimatedTabProps) {
  const isActive = currentValue === value;

  return (
    <TabsContent value={value} forceMount className={cn("p-0 relative", !isActive && "hidden")}>
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn("overflow-hidden", className)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TabsContent>
  );
}
