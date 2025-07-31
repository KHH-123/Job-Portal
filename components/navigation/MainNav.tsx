'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Briefcase, 
  Building2, 
  Bell,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Shield,
  Activity,
  Home
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';

interface MainNavProps {
  user?: any;
}

function UserMenuDropdown({ user }: { user: any }) {
  const router = useRouter();
  
  // Role-based navigation
  const getNavItems = (userRole: string) => {
    if (userRole === 'employer') {
      return [
        { href: '/dashboard/employer', icon: Home, label: 'Dashboard' },
        { href: '/dashboard/employer/jobs', icon: Briefcase, label: 'My Jobs' },
        { href: '/dashboard/employer/applications', icon: User, label: 'Applications' },
        { href: '/dashboard/employer/company', icon: Building2, label: 'Company Profile' },
        { href: '/dashboard/security', icon: Shield, label: 'Security' }
      ];
    } else {
      return [
        { href: '/dashboard', icon: Home, label: 'Dashboard' },
        { href: '/jobs', icon: Search, label: 'Find Jobs' },
        { href: '/dashboard/applications', icon: Briefcase, label: 'My Applications' },
        { href: '/dashboard/profile', icon: User, label: 'Profile' },
        { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
        { href: '/dashboard/security', icon: Shield, label: 'Security' }
      ];
    }
  };
  
  const navItems = user ? getNavItems(user.role) : [];

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage alt={user.name || ''} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="px-3 py-3 border-b border-gray-100 mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">{user.name || user.email}</div>
              <div className="text-xs text-gray-500 capitalize">
                {user.role === 'job_seeker' ? 'Job Seeker' : 'Employer'}
              </div>
            </div>
          </div>
        </div>
        
        {navItems.map((item) => (
          <DropdownMenuItem key={item.href} className="cursor-pointer rounded-md">
            <Link href={item.href} className="flex w-full items-center px-2 py-1">
              <item.icon className="mr-3 h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        
        <div className="border-t border-gray-100 mt-2 pt-2">
          <form action={handleSignOut} className="w-full">
            <button type="submit" className="flex w-full">
              <DropdownMenuItem className="w-full flex-1 cursor-pointer rounded-md text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="mr-3 h-4 w-4" />
                <span className="text-sm">Sign out</span>
              </DropdownMenuItem>
            </button>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MainNav({ user }: MainNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      title: 'Find Jobs',
      href: '/jobs',
      icon: Search,
      description: 'Browse thousands of job opportunities'
    },
    {
      title: 'Companies',
      href: '/companies',
      icon: Building2,
      description: 'Explore company profiles and open positions'
    }
  ];

  const employerItems = user?.role === 'employer' ? [
    {
      title: 'My Jobs',
      href: '/dashboard/employer/jobs',
      icon: Briefcase,
      description: 'Manage your job postings'
    },
    {
      title: 'Applications',
      href: '/dashboard/employer/applications',
      icon: User,
      description: 'Review candidate applications'
    }
  ] : [];

  const isActivePath = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">JP</span>
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                JobPortal
              </span>
              <div className="text-xs text-gray-500 -mt-1">Find Your Dream Job</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActivePath(item.href)
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 p-2">
                    <Link href={item.href}>
                      <DropdownMenuItem className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer">
                        <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}

            {/* Employer-specific navigation */}
            {employerItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActivePath(item.href)
                        ? 'bg-green-50 text-green-600 font-semibold'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Quick Search */}
                <div className="hidden md:flex items-center">
                  <form action="/jobs" method="get">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        name="search"
                        placeholder="Search jobs..."
                        className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </form>
                </div>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative p-2">
                      <Bell className="h-5 w-5 text-gray-600" />
                      {/* Notification badge removed - no backend implementation */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No new notifications</p>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Messages */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative p-2">
                      <MessageCircle className="h-5 w-5 text-gray-600" />
                      {/* Message badge removed - no backend implementation */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Messages</h3>
                    </div>
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No new messages</p>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <UserMenuDropdown user={user} />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button variant="ghost" className="font-medium text-gray-700 hover:text-blue-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-medium shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <div className="space-y-2">
              {/* Search on Mobile */}
              <div className="px-3 pb-4">
                <form action="/jobs" method="get">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Search jobs..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </form>
              </div>

              {/* Navigation Items */}
              {[...navigationItems, ...employerItems].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`mx-3 px-3 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                      isActivePath(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm opacity-75">{item.description}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="px-3 pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/sign-in" className="block">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}