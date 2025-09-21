"use client";

import { useEffect, useState, useRef } from "react";
import Ping from "@/components/Ping";
import { formatNumber } from "@/lib/utils";

interface UniqueViewProps {
  startupId: string;
  initialUniqueViewsCount?: number;
  initialTotalViews?: number;
}

const UniqueView = ({ startupId, initialUniqueViewsCount = 0, initialTotalViews = 0 }: UniqueViewProps) => {
  const [uniqueViewsCount, setUniqueViewsCount] = useState(initialUniqueViewsCount);
  const [totalViews, setTotalViews] = useState(initialTotalViews);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // Only track once per page load using ref to persist across re-renders
    if (hasTrackedRef.current) return;
    
    const trackUniqueView = async () => {
      hasTrackedRef.current = true;
      
      try {
        const response = await fetch(`/api/startup/${startupId}/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUniqueViewsCount(data.uniqueViewsCount);
          setTotalViews(data.totalViews);
        }
      } catch (error) {
        console.error("Error tracking unique view:", error);
        // Reset tracking flag on error so it can be retried
        hasTrackedRef.current = false;
      }
    };

    trackUniqueView();
  }, [startupId]);

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <div className="flex flex-col gap-1">
        <p className="view-text">
          <span className="font-black">{formatNumber(uniqueViewsCount)}</span> unique views
        </p>
        <p className="view-text text-sm text-gray-500">
          <span className="font-medium">{formatNumber(totalViews)}</span> total visits
        </p>
      </div>
    </div>
  );
};

export default UniqueView;
