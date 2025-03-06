
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type User = {
  username: string;
  displayName: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, displayName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('procrastinator_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // For this app, we'll use localStorage for a simple auth system
    const users = JSON.parse(localStorage.getItem('procrastinator_users') || '[]');
    const foundUser = users.find((u: any) => u.username === username && u.password === password);
    
    if (foundUser) {
      const userInfo = {
        username: foundUser.username,
        displayName: foundUser.displayName,
      };
      
      localStorage.setItem('procrastinator_user', JSON.stringify(userInfo));
      setUser(userInfo);
      setIsAuthenticated(true);
      toast({
        title: "Welcome back!",
        description: `Good to see you again, ${foundUser.displayName}`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      throw new Error('Invalid credentials');
    }
  };

  const register = async (username: string, password: string, displayName: string) => {
    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('procrastinator_users') || '[]');
    
    // Check if username already exists
    if (existingUsers.some((u: any) => u.username === username)) {
      toast({
        title: "Registration failed",
        description: "Username already exists",
        variant: "destructive",
      });
      throw new Error('Username already exists');
    }
    
    // Add new user
    const newUser = {
      username,
      password,
      displayName,
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('procrastinator_users', JSON.stringify(updatedUsers));
    
    // Automatically log in the user
    const userInfo = {
      username,
      displayName,
    };
    
    localStorage.setItem('procrastinator_user', JSON.stringify(userInfo));
    setUser(userInfo);
    setIsAuthenticated(true);
    
    toast({
      title: "Welcome to Procrastinator's Paradise!",
      description: "Your account has been created successfully",
    });
  };

  const logout = () => {
    localStorage.removeItem('procrastinator_user');
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
