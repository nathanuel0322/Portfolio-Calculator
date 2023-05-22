import "./App.css";
import { getHistoricalDataBySymbol, getAllSymbols } from "./utils/WTDApi";

function App() {
  const obj = getHistoricalDataBySymbol("2020-02-20", "GOOG", 32500 * 0.2);
  console.log(obj);

  console.log(getAllSymbols());

  return <div>Portfolio Calculator</div>;
}

export default App;
