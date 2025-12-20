import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton loader component for content placeholders.
 * Improves perceived performance and prevents layout shift.
 */
export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
}: SkeletonProps) {
    const animationClass = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: '',
    }[animation];

    const variantClass = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    }[variant];

    return (
        <div
            className={cn(
                'bg-muted/50',
                animationClass,
                variantClass,
                className
            )}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        />
    );
}

/**
 * Pre-built skeleton for card layouts
 */
export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('p-6 border border-border rounded-xl bg-card', className)}>
            <div className="flex items-center gap-4 mb-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={12} width="40%" />
                </div>
            </div>
            <Skeleton height={12} className="mb-2" />
            <Skeleton height={12} className="mb-2" />
            <Skeleton height={12} width="80%" />
        </div>
    );
}

/**
 * Pre-built skeleton for session cards
 */
export function SessionCardSkeleton() {
    return (
        <div className="p-4 border border-border rounded-xl bg-card">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-2">
                    <Skeleton height={20} width="70%" />
                    <Skeleton height={14} width="40%" />
                </div>
                <Skeleton height={24} width={64} className="rounded-full" />
            </div>
            <Skeleton height={14} className="mb-2" />
            <Skeleton height={14} width="90%" className="mb-4" />
            <div className="flex items-center gap-4">
                <Skeleton height={12} width={80} />
                <Skeleton height={12} width={60} />
            </div>
        </div>
    );
}

/**
 * Pre-built skeleton for agent cards
 */
export function AgentCardSkeleton() {
    return (
        <div className="p-4 border border-border rounded-xl bg-card">
            <div className="flex items-center justify-between mb-3">
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton height={20} width={60} className="rounded-full" />
            </div>
            <Skeleton height={16} width="50%" className="mb-2" />
            <Skeleton height={12} width="30%" />
        </div>
    );
}

/**
 * Pre-built skeleton for table rows
 */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
    return (
        <tr className="border-b border-border">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton height={16} width={i === 0 ? '80%' : '60%'} />
                </td>
            ))}
        </tr>
    );
}

/**
 * Pre-built skeleton for profile page
 */
export function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-6 p-6 border border-border rounded-xl bg-card">
                <Skeleton variant="circular" width={80} height={80} />
                <div className="flex-1 space-y-2">
                    <Skeleton height={24} width="40%" />
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={16} width="30%" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 border border-border rounded-xl bg-card">
                        <Skeleton height={12} width="60%" className="mb-2" />
                        <Skeleton height={28} width="40%" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Skeleton;
