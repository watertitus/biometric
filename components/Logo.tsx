import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = '' 
}) => {
  const sizeConfig = {
    sm: { width: 40, height: 40, textSize: 'text-sm' },
    md: { width: 50, height: 50, textSize: 'text-lg' },
    lg: { width: 60, height: 60, textSize: 'text-xl' }
  };

  const { width, height, textSize } = sizeConfig[size];

  return (
    <Link href="/" className={`flex items-center space-x-3 bg-white py-3 ${className}`}>
      {/* Logo Image */}
      <div className="relative flex-shrink-0">
        <Image
          src="https://eksu.edu.ng/wp-content/uploads/2023/01/logo.jpg"
          alt="EKiti State University Logo"
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      </div>
 
     
    </Link>
  );
};

export default Logo;