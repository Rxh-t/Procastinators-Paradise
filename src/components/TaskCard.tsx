
import React from 'react';
import { format } from 'date-fns';
import { Task, useTask } from '@/context/TaskContext';
import CategoryBadge from './CategoryBadge';
import { cn } from '@/lib/utils';
import { Check, Trash2, Calendar, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { toggleTaskCompletion, deleteTask, getCategory } = useTask();
  const category = getCategory(task.categoryId);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  };

  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "glass-card w-full p-4 mb-3 cursor-pointer transform transition-all duration-300",
        task.completed && "opacity-60"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className={cn(
            "text-lg font-medium mb-1 pr-6",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className={cn(
              "text-sm text-muted-foreground mb-2",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          )}
        </div>
        <button 
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center border transition-colors",
            task.completed ? "bg-green-500 border-green-500" : "border-input hover:border-primary"
          )}
          onClick={handleToggleComplete}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <Check className="text-white" size={12} />}
        </button>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {category && <CategoryBadge category={category} />}
          
          {task.dueDate && (
            <div className="text-xs flex items-center text-muted-foreground">
              <Calendar size={12} className="mr-1" /> 
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
        
        <div className="flex space-x-1">
          <button 
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
            }}
            aria-label="Edit task"
          >
            <Edit size={14} />
          </button>
          <button 
            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
            onClick={handleDeleteTask}
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
