import React, { useEffect, useState } from "react";
import { Rate, Progress } from "antd";
import { getStoreRatingDetails } from "../../services/store";

const RatingBreakdown = ({ distribution }) => {
  const [totalRatings, setTotalRating] = useState(0);

  return (
    <div style={{ width: 300 }}>
      {distribution
        .sort((a, b) => b.star - a.star)
        .map((item) => (
          <div
            key={item.star}
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <Rate disabled defaultValue={item.star} />
            <Progress
              percent={parseFloat(item.percent)}
              showInfo={false}
              strokeColor="#fadb14"
              style={{ flex: 1, marginLeft: 8 }}
            />
            <span style={{ marginLeft: 8 }}>{item.count}</span>
          </div>
        ))}
    </div>
  );
};

export default RatingBreakdown;
