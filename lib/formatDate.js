export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const diffTime = now - date;
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relativeTime = "";
  if (diffSeconds < 60) {
    relativeTime = `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
  } else if (diffMinutes < 60) {
    relativeTime = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    relativeTime = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else {
    relativeTime = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  return `${formattedDate} (${relativeTime})`;
};
