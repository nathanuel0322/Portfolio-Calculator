import axios from "axios";

const BASE_URL = `https://www.alphavantage.co/query?apikey=${import.meta.env.VITE_ALPHA_KEY}`;

let isFetchingData = false;
export const getHistoricalDataBySymbol = async (symbol) => {
  if (isFetchingData) {
    // If a request is already in progress, wait until it completes
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getHistoricalDataBySymbol(symbol); // Retry the request after waiting
  }

  try {
    isFetchingData = true;
    console.log("starting getHistoricalDataBySymbol");
    const { data } = await axios.get(
      BASE_URL + `&function=TIME_SERIES_DAILY&outputsize=full&symbol=${symbol}`
    );
  
    if (data.hasOwnProperty("Time Series (Daily)")) {
      console.log("ending getHistoricalDataBySymbol");
      return data["Time Series (Daily)"];
    }
    console.log("ending getHistoricalDataBySymbol without data");
    return data;
  } finally {
    isFetchingData = false;
  }
};

// *Keyword: The keyword is the name of the symbol that the user is currently typing in the autocomplete dropdown selector.
export const getAllSymbols = async (keyword) => {
  const { data } = await axios.get(
    BASE_URL + `&function=SYMBOL_SEARCH&keywords=${keyword}`
  );
  console.log("data in getAllSymbols:", data)
  const result = data["bestMatches"].map((s) => {
    return {
      name: s["2. name"],
      symbol: s["1. symbol"],
    };
  });

  return result;
};
