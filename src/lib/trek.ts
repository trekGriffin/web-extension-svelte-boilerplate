export function getCurrentDateTime() {
    const currentDateTime = new Date();
    // Get the hours and minutes
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');

    // Assemble the formatted date-time string
    //  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    const formattedDateTime = `${hours}:${minutes}`;

    return formattedDateTime;
  }

