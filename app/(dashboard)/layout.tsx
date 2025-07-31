'use client';

import Link from 'next/link';
import { use, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon, Home, LogOut, Settings, Shield, Activity, User as UserIcon, Briefcase, Search, Users, BarChart3, Building, Bell, MessageCircle, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { MainNav } from '@/components/navigation/MainNav';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();
  const pathname = usePathname();

  // Role-based navigation
  const getNavItems = (userRole: string) => {
    if (userRole === 'employer') {
      return [
        { href: '/dashboard/employer', icon: Home, label: 'Dashboard' },
        { href: '/dashboard/employer/jobs', icon: Briefcase, label: 'My Jobs' },
        { href: '/dashboard/employer/applications', icon: Users, label: 'Applications' },
        { href: '/dashboard/employer/company', icon: Building, label: 'Company Profile' },
        { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
        { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
        { href: '/dashboard/security', icon: Shield, label: 'Security' }
      ];
    } else {
      return [
        { href: '/dashboard', icon: Home, label: 'Dashboard' },
        { href: '/jobs', icon: Search, label: 'Find Jobs' },
        { href: '/dashboard/applications', icon: Briefcase, label: 'My Applications' },
        { href: '/dashboard/profile', icon: UserIcon, label: 'Profile' },
        { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
        { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
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

  if (!user) {
    return (
      <>
        <Button asChild className="rounded-full">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
            {user.email
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1 w-48">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{user.name || user.email}</div>
              <div className="text-sm text-gray-500 capitalize">
                {user.role === 'job_seeker' ? 'Job Seeker' : 'Employer'}
              </div>
            </div>
          </div>
        </div>
        {navItems.map((item) => (
          <DropdownMenuItem key={item.href} className="cursor-pointer">
            <Link href={item.href} className="flex w-full items-center">
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <div className="border-t border-gray-100">
          <form action={handleSignOut} className="w-full">
            <button type="submit" className="flex w-full">
              <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </button>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  
  return <MainNav user={user} />;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
