interface TimeSeriesData {
    [key: string]: {
        "1. open": string;
        "2. high": string;
        "3. low": string;
        "4. close": string;
        "5. volume": string;
    };
}

interface AlphaData {
    "Meta Data": {
        [key: string]: string;
    };
    "Time Series (Daily)": TimeSeriesData;
}

export interface AlphaError {
    Note: string;
}

let isFetchingData = false;

export async function getHistoricalDataBySymbol(symbol: string): Promise<AlphaData | AlphaError> {
    if (isFetchingData) {
        // If a request is already in progress, wait until it completes
        await new Promise((resolve) => setTimeout(resolve, 100));
        return getHistoricalDataBySymbol(symbol); // Retry the request after waiting
    }

    try {
        isFetchingData = true;
        // console.log("starting getHistoricalDataBySymbol");
        const response = await fetch(
            `https://www.alphavantage.co/query?apikey=${import.meta.env.VITE_ALPHA_KEY}` +
                `&function=TIME_SERIES_DAILY&outputsize=full&symbol=${symbol}`
        );

        const data = await response.json();
        // console.log("data: ", data);

        if (data.hasOwnProperty("Time Series (Daily)")) {
            // console.log("ending getHistoricalDataBySymbol");
            return data["Time Series (Daily)"];
        }
        // console.log("ending getHistoricalDataBySymbol without data");
        return data;
    } finally {
        isFetchingData = false;
    }
}
