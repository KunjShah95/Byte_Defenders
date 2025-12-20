import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analytics';

export function RouteAnalytics() {
    const location = useLocation();

    useEffect(() => {
        analytics.pageView(location.pathname);
    }, [location.pathname]);

    return null;
}

export default RouteAnalytics;
