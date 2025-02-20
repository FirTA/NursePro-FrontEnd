import React from "react";

const TimeView = ({ time }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div>
      <p>{formatDate(time)}</p>
    </div>
  );
};

export default TimeView;
