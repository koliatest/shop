export default function parseDate(date) {
  const fullDate = date.split('T')[0];
  const fullTime = date.split('T')[1].slice(0, date.split('T')[1].indexOf('.'));
  return {
    year: fullDate.split('-')[0],
    month: fullDate.split('-')[1],
    day: fullDate.split('-')[2],
    hour: fullTime.split(':')[0],
    minute: fullTime.split(':')[1],
    second: fullTime.split(':')[2]
  };
}
