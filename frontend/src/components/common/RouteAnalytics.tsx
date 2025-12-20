import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analytics';

/**
 * Route Analytics component that tracks page views.
 * Should be placed inside the Router component.
 */
export function RouteAnalytics() {
    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        analytics.pageView(location.pathname);
    }, [location.pathname]);

    return null;
}

export default RouteAnalytics;
