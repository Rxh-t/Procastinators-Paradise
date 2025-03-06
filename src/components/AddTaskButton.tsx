
import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AddTaskButtonProps {
  onClick: () => void;
  className?: string;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick, className }) => {
  return (
    <motion.button
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
};

export default AddTaskButton;
