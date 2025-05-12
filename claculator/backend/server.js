const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 9876; 
const WINDOW_SIZE = 10; 

let storedNumbers = [];

app.use(cors());

const API_BASE_URL = "http://20.244.56.144/evaluation-service/";

async function fetchNumbers(numberId) {
  const urlMap = {
    p: "primes",
    f: "fibo",
    e: "even",
    r: "rand",
  };

  const url = urlMap[numberId];
  if (!url) return [];

  try {
    const response = await axios.get(`${API_BASE_URL}${url}`);
    return response.data.numbers || [];
  } catch (error) {
    console.error("Error fetching numbers:", error);
    return [];
  }
}

function calculateAverage(numbers) {
  return numbers.length ? (numbers.reduce((acc, num) => acc + num, 0) / numbers.length).toFixed(2) : 0;
}

app.get("/numbers/:numberId", async (req, res) => {
  const { numberId } = req.params;

  const fetchedNumbers = await fetchNumbers(numberId);

  if (!fetchedNumbers.length) {
    return res.status(500).json({ error: "Failed to fetch numbers from the third-party service." });
  }

  storedNumbers = [...new Set([...storedNumbers, ...fetchedNumbers])];
  if (storedNumbers.length > WINDOW_SIZE) {
    storedNumbers = storedNumbers.slice(-WINDOW_SIZE);
  }

  const avg = calculateAverage(storedNumbers);

  res.json({
    windowPrevState: storedNumbers.slice(0, storedNumbers.length - fetchedNumbers.length),
    windowCurrState: storedNumbers,
    numbers: fetchedNumbers,
    avg: parseFloat(avg),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
