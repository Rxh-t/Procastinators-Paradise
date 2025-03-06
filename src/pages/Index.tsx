
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder quotes for procrastination
  const procrastinationQuotes = [
    "Why do today what you can put off until tomorrow?",
    "Hard work often pays off after time, but procrastination always pays off right now.",
    "Procrastination is the art of keeping up with yesterday.",
    "If it weren't for the last minute, nothing would get done.",
    "I never put off till tomorrow what I can do the day after."
  ];
  
  const [quote, setQuote] = useState(procrastinationQuotes[Math.floor(Math.random() * procrastinationQuotes.length)]);

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Change quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newQuote = procrastinationQuotes[Math.floor(Math.random() * procrastinationQuotes.length)];
      setQuote(newQuote);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(username, password);
      navigate('/dashboard');
      toast({
        title: "Welcome back!",
        description: "We missed watching you procrastinate.",
      });
    } catch (err) {
      setError('Invalid username or password');
      toast({
        title: "Login failed",
        description: "Even your login attempts are getting procrastinated.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    
    if (!displayName) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }
    
    try {
      await register(username, password, displayName);
      navigate('/dashboard');
      toast({
        title: "Account created",
        description: "Welcome to Procrastinator's Paradise! Where tasks go to hibernate.",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      toast({
        title: "Registration failed",
        description: "Maybe try again later... or next week... or never?",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background overflow-hidden">
      {/* Floating animated shapes in background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-primary/20 animate-float blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/30 animate-float blur-3xl" style={{animationDelay: "1s"}}></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full bg-secondary/20 animate-float blur-3xl" style={{animationDelay: "2s"}}></div>
      </div>
      
      <motion.div 
        className="w-full max-w-md space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-2">
          <motion.h1 
            className="text-4xl font-bold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Procrastinator's Paradise
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Finally, a to-do list that understands you.
          </motion.p>
          
          <motion.div
            className="mt-3 text-sm italic text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            "{quote}"
          </motion.div>
        </div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input 
                    id="login-username"
                    type="text" 
                    placeholder="Enter your username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password"
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground pt-2">
                  <p>Demo account: guest / password123</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-displayname">Your Name</Label>
                  <Input 
                    id="register-displayname"
                    type="text" 
                    placeholder="Enter your name" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input 
                    id="register-username"
                    type="text" 
                    placeholder="Choose a username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password"
                    type="password" 
                    placeholder="Choose a password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div 
          className="text-center text-sm text-muted-foreground pt-4 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p>Rohit Bagewadi Presents: Procrastinator's Paradise</p>
          <p className="text-xs">Where tasks go to be postponed indefinitely</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
