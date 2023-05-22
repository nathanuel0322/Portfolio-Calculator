import "./App.css";
import { getHistoricalDataBySymbol, getAllSymbols } from "./utils/WTDApi";
import { PortfolioForm } from "./components/PortfolioForm";

function App() {
  return <div >Portfolio Calculator
  <div className="container mx-auto">
<PortfolioForm/>
  </div>

  
  </div>;
}

export default App;
