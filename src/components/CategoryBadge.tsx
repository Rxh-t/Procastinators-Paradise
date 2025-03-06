
import React from 'react';
import { Category } from '@/context/TaskContext';
import { cn } from '@/lib/utils';
import { 
  ShoppingBag, 
  Music, 
  Book, 
  PartyPopper, 
  Bookmark,
  Briefcase,
  Coffee,
  Zap,
  Heart,
  Star,
  Clock,
  Hash
} from 'lucide-react';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  const getIcon = (iconName: string) => {
    const iconProps = { size: 14, className: "mr-1" };
    
    switch (iconName) {
      case 'shopping-bag':
        return <ShoppingBag {...iconProps} />;
      case 'music':
        return <Music {...iconProps} />;
      case 'book':
        return <Book {...iconProps} />;
      case 'party-popper':
        return <PartyPopper {...iconProps} />;
      case 'bookmark':
        return <Bookmark {...iconProps} />;
      case 'briefcase':
        return <Briefcase {...iconProps} />;
      case 'coffee':
        return <Coffee {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      default:
        return <Hash {...iconProps} />;
    }
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center text-xs font-medium px-2 py-1 rounded-full",
        className
      )}
      style={{ 
        backgroundColor: `${category.color}20`, 
        color: category.color,
        borderColor: `${category.color}40`,
        borderWidth: '1px'
      }}
    >
      {getIcon(category.icon)}
      {category.name}
    </div>
  );
};

export default CategoryBadge;
