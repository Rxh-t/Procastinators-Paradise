
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTask, Task } from '@/context/TaskContext';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import AddTaskButton from '@/components/AddTaskButton';
import AddTaskModal from '@/components/AddTaskModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { tasks, categories } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [showTagline, setShowTagline] = useState(true);

  // Fixed tagline for when users login
  const tagline = "Finally, a to-do list that understands you.";
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Auto-hide tagline after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTagline(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter and search tasks
  useEffect(() => {
    console.log("Search query:", searchQuery);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      console.log("Filtering with query:", query);
      filtered = filtered.filter(task => {
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query);
        console.log(`Task "${task.title}": titleMatch=${titleMatch}, descMatch=${descMatch}`);
        return titleMatch || descMatch;
      });
    }
    
    // Apply tab filter
    switch (activeFilter) {
      case 'today':
        filtered = filtered.filter(task => 
          task.dueDate && 
          new Date(task.dueDate).toDateString() === new Date().toDateString()
        );
        break;
      case 'upcoming':
        filtered = filtered.filter(task => 
          task.dueDate && 
          new Date(task.dueDate) > new Date() &&
          new Date(task.dueDate).toDateString() !== new Date().toDateString()
        );
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }
    
    // Sort by completion status and then by due date
    filtered.sort((a, b) => {
      // First sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by due date
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    console.log("Filtered tasks count:", filtered.length);
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, activeFilter]);

  // Check for overdue tasks
  useEffect(() => {
    const now = new Date();
    const overdueTask = tasks.find(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    );
    
    if (overdueTask) {
      // Show sarcastic toast for overdue tasks, but not too frequently
      const lastToastTime = localStorage.getItem('lastOverdueToast');
      const shouldShowToast = !lastToastTime || (Date.now() - parseInt(lastToastTime)) > 1000 * 60 * 60; // Once per hour
      
      if (shouldShowToast) {
        setTimeout(() => {
          toast({
            title: "Overdue Task Alert",
            description: "Wow, looks like someone's really embracing the 'tomorrow' lifestyle. Your task is overdue... but hey, no rush.",
            variant: "destructive"
          });
          localStorage.setItem('lastOverdueToast', Date.now().toString());
        }, 2000);
      }
    }
  }, [tasks]);

  const openAddTaskModal = () => {
    setEditingTask(null);
    setIsAddTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsAddTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsAddTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSearch = (query: string) => {
    console.log("Search query updated:", query);
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Header onSearch={handleSearch} />
      
      <main className="container max-w-3xl mx-auto p-4 pb-20">
        <AnimatePresence>
          {showTagline && (
            <motion.div 
              className="my-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.p 
                className="text-lg text-foreground/80"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {tagline}
              </motion.p>
              <motion.p 
                className="text-xs text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                Crafted with ❤️ by Rohit Bagewadi
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Tabs 
          defaultValue="all" 
          value={activeFilter}
          onValueChange={(value) => setActiveFilter(value as any)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {filteredTasks.length === 0 ? (
              <EmptyState openAddTaskModal={openAddTaskModal} searchQuery={searchQuery} />
            ) : (
              <AnimatedTaskList 
                tasks={filteredTasks} 
                categories={categories} 
                onTaskClick={openEditTaskModal} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="today" className="mt-0">
            {filteredTasks.length === 0 ? (
              <EmptyState 
                message="No tasks due today" 
                subMessage={searchQuery ? "No matching tasks for today" : "Enjoy your peaceful day or add something new"} 
                openAddTaskModal={openAddTaskModal} 
                searchQuery={searchQuery}
              />
            ) : (
              <AnimatedTaskList 
                tasks={filteredTasks} 
                categories={categories} 
                onTaskClick={openEditTaskModal} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            {filteredTasks.length === 0 ? (
              <EmptyState 
                message="No upcoming tasks" 
                subMessage={searchQuery ? "No matching upcoming tasks" : "Your future looks clear"} 
                openAddTaskModal={openAddTaskModal} 
                searchQuery={searchQuery}
              />
            ) : (
              <AnimatedTaskList 
                tasks={filteredTasks} 
                categories={categories} 
                onTaskClick={openEditTaskModal} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {filteredTasks.length === 0 ? (
              <EmptyState 
                message="No completed tasks yet" 
                subMessage={searchQuery ? "No matching completed tasks" : "Complete some tasks to see them here... if you ever do."} 
                openAddTaskModal={openAddTaskModal} 
                searchQuery={searchQuery}
              />
            ) : (
              <AnimatedTaskList 
                tasks={filteredTasks} 
                categories={categories} 
                onTaskClick={openEditTaskModal} 
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <AddTaskButton onClick={openAddTaskModal} />
      
      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={closeTaskModal} 
        editTask={editingTask} 
      />
    </div>
  );
};

// Empty state component
const EmptyState = ({ 
  message = "No tasks found", 
  subMessage = "Start by adding your first task", 
  openAddTaskModal,
  searchQuery = ""
}: { 
  message?: string; 
  subMessage?: string; 
  openAddTaskModal: () => void; 
  searchQuery?: string;
}) => {
  const isSearching = searchQuery && searchQuery.trim() !== '';
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-24 h-24 mb-6 text-muted-foreground opacity-50">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6">{subMessage}</p>
      {!isSearching && (
        <motion.button
          onClick={openAddTaskModal}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add your first task
        </motion.button>
      )}
      {isSearching && (
        <p className="text-sm text-muted-foreground">
          No tasks match your search for "{searchQuery}". <br />
          Maybe try a different search or <button onClick={() => window.location.reload()} className="text-primary underline">clear your search</button>?
        </p>
      )}
    </motion.div>
  );
};

// Animated task list component
const AnimatedTaskList = ({ 
  tasks, 
  categories, 
  onTaskClick 
}: { 
  tasks: Task[];
  categories: any[];
  onTaskClick: (task: Task) => void; 
}) => {
  if (tasks.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {tasks.map(task => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
          >
            <TaskCard task={task} onClick={() => onTaskClick(task)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
